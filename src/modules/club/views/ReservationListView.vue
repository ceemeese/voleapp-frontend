<script setup lang="ts">
import { ReservationStatus, type ReservationComplete, type ReservationDataDialog } from '@/modules/reservation/interfaces';
import type { ColumnConfig } from 'ui';
import { animate, stagger } from 'animejs';


const { getClubReservations, updateStatusReservation } = useReservation();
const { activeClubId } = useClub();
const toast = useToast();
const confirmPopup = useConfirm();
const reservationDialogRef = ref();

const selectedReservation = ref<ReservationComplete | null>(null);
const reservations = ref<ReservationComplete[]>([]);

const dateRange = ref<Date[]>([
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0)
]);

const headerColumns: ColumnConfig<ReservationComplete>[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'username', header: 'Cliente', sortable: false },
    { field: 'date', header: 'Fecha', sortable: true },
    { field: 'time', header: 'Horario', sortable: false },
    { field: 'courtName', header: 'Pista', sortable: false },
    { field: 'totalPrice', sortField: 'price.totalPrice', header: 'Precio', sortable: true },
    { field: 'discount', sortField: 'price.discountAmount', header: 'Descuento', sortable: true },
    { field: 'status', header: 'Estado', sortable: false },
    { 
        field: 'actions', 
        header: '', 
        sortable: false, 
        actions: [
            {
                isVisible: (res: ReservationComplete) => canCancel(res),
                icon: 'pi pi-ban',
                class: '!text-red-500',
                action: (res: ReservationComplete, event) => handleUpdateStatus(res, ReservationStatus.Cancelled, event)
            },
            {
                isVisible: (res: ReservationComplete) => canRefund(res),
                icon: 'pi pi-refresh',
                class: '!text-orange-500',
                action: (res: ReservationComplete, event) => handleUpdateStatus(res, ReservationStatus.Refunded, event)
            },
            {
                isVisible: true,
                icon: 'pi pi-eye',
                class: '!text-slate-400',
                action: (res: ReservationComplete) => openReservationDetail(res)
            }
        ]
    }
];


const canCancel = (res: ReservationComplete) => {
    return ![ReservationStatus.Cancelled, ReservationStatus.Refunded, ReservationStatus.Completed].includes(res.status.id);
};

const canRefund = (res: ReservationComplete) => {
    return res.status.id === ReservationStatus.Confirmed;
};

const loadReservations = async (startDate?: string, endDate?: string) => {
    if (!activeClubId.value) return;
    try {

        const start = startDate || toDateOnlyString(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
        const end = endDate || toDateOnlyString(new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0));


        const data = await getClubReservations(activeClubId.value, start, end);
        reservations.value = data;
        animateTableRows();
    } catch (error : unknown) {
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error', detail: message, life: 2000 });
    }
};


const handleUpdateStatus = async (res: ReservationComplete, newStatus: ReservationStatus , event: PointerEvent) => {
    const actionName = newStatus === ReservationStatus.Cancelled ? 'anular' : 'reembolsar';

    const target = event.currentTarget as HTMLElement;
    confirmPopup.require({
        target: target,
        message: `Estás seguro de que quieres ${actionName} la reserva?`,
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'No',
            severity: 'secondary',
            outlined: true
        } ,
        acceptProps: {
            label: actionName.charAt(0).toUpperCase() + actionName.slice(1),
            severity: newStatus === ReservationStatus.Cancelled ? 'danger' : 'warning'
        },
        accept: async () => {
            try {
                 await updateStatusReservation(res.id, newStatus);
        
                res.status.id = newStatus;
                res.status.status = ReservationStatus[newStatus] ?? 'Unknown';

                toast.add({ 
                    severity: 'success', 
                    summary: 'Completado', 
                    detail: `Reserva ${actionName === 'anular' ? 'anulada' : 'reembolsada'} correctamente`, 
                    life: 2000 
                });

            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Error inesperado';
                toast.add({ severity: 'error', summary: 'Error de acceso', detail: message, life: 2000 });
            }
        },
    });
};

const openReservationDetail = (reservation : ReservationComplete) => {

    selectedReservation.value = reservation;
    const summarizedReservation: ReservationDataDialog = {
        id: reservation.id,
        userId: reservation.userId,
        clubId: reservation.clubId,
        courtId: reservation.courtId,
        courtName: reservation.courtName,
        type: reservation.courtId,
        clubName: reservation.clubName,
        clubAddress: reservation.clubId,
        date: reservation.date.toLocaleDateString('sv-SE'),
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        status: reservation.status.status,
        duration: calculateDuration(reservation.startTime, reservation.endTime),
        price: reservation.price,
        createdAt: reservation.createdAt
    };
   reservationDialogRef.value.open(summarizedReservation);
}

const animateTableRows = async () => {
    await nextTick(); 
    animate('tbody tr', {
        opacity: [0, 1],
        translateX: [-20, 0],
        delay: stagger(30),
        duration: 500,
        easing: 'out-quartic'
    });
};

const rowsPerPage = ref(5);

const updateRows = () => {
    if (window.innerWidth > 1512) {
        rowsPerPage.value = 8;
    } else {
        rowsPerPage.value = 5;
    }
};


watch(dateRange, async (newRange) => {
    if (newRange && newRange[0] && newRange[1]) {
        const startStr = toDateOnlyString(newRange[0]);
        const endStr = toDateOnlyString(newRange[1]);
        
        await loadReservations(startStr, endStr);
    }
})

onMounted(async () => {
   if (dateRange.value && dateRange.value.length === 2) {
        const [start, end] = dateRange.value;
        
        if (start && end) {
            await loadReservations(toDateOnlyString(start), toDateOnlyString(end));
        }
    }
    
    updateRows();
    window.addEventListener('resize', updateRows)
});

onUnmounted(() => {
    window.removeEventListener('resize', updateRows);
});
</script>

<template>
    <div class="flex flex-col overflow-hidden h-full w-full p-6 space-y-6">
        <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6 border-b border-slate-200 pb-5">
            <div>
                <h2 class="text-xl font-black text-slate-800 uppercase italic">Gestión de reservas</h2>
                <p class="text-sm text-slate-500">Historial de reservas</p>
            </div>
        </div>
        
        <BaseCard padding="p-4">
            <BaseDataTable
                :value="reservations"
                :columns="headerColumns"
                :show-search="true"
                :globalFilterFields="['id', 'username', 'courtName']"
                :removable-sort="true"
                :rows="rowsPerPage"
                :paginator="true"
                scrollable
                scrollHeight="400px"
            >
                <template #table-actions>
                    <div class="flex flex-wrap gap-2 w-full items-center justify-end">
                        <BaseDatePicker 
                            v-model="dateRange" 
                            selectionMode="range" 
                            :manualInput="false" 
                            placeholder="Filtrar por rango"
                            size="small"
                            showIcon
                            iconDisplay="input"
                            class="min-w-[250px] flex-1 sm:flex-none"
                        />
                    </div>
                </template>

                <template #username="{ data }">
                    <div class="flex flex-col">
                        <span class="font-bold text-slate-700">{{ data.username || 'Usuario' }}</span>
                    </div>
                </template>

                <template #date="{ data }">
                    <span class="text-sm">{{ new Date(data.date).toLocaleDateString() }}</span>
                </template>

                <template #time="{ data }">
                    <div class="flex items-center gap-1 text-xs font-mono">
                        <i class="pi pi-clock text-slate-400"></i>
                        {{ data.startTime }} - {{ data.endTime }}
                    </div>
                </template>

                 <template #courtName="{ data }">
                    <span class="font-bold text-slate-700">{{ data.courtName }}</span>
                </template>

                <template #totalPrice="{ data }">
                    <span class="font-bold text-slate-700">{{ data.price.totalPrice }}€</span>
                </template>

                <template #discount="{ data }">
                    <div v-if="data.price && data.price.appliedDiscountPercent > 0" class="flex gap-1">
                        <span class="text-xs font-bold text-indigo-600">
                            -{{ data.price.discountAmount }}€
                        </span>
                        <span class="text-[10px] text-slate-400 font-medium">
                            ({{ data.price.appliedDiscountPercent }}%)
                        </span>
                    </div>
                    <span v-else class="text-xs text-slate-400 italic">—</span>
                </template>

                <template #status="{ data }">
                    <div class="flex items-center">
                        <div :class="[
                            'px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-wider border',
                            data.status.id === ReservationStatus.Confirmed ? 'bg-green-50 text-green-700 border-green-100' :
                            data.status.id === ReservationStatus.Cancelled ? 'bg-red-50 text-red-700 border-red-100' :
                            data.status.id === ReservationStatus.Refunded ? 'bg-orange-50 text-orange-700 border-orange-100' :
                            'bg-slate-100 text-slate-500 border-slate-200'
                        ]">
                            {{ STATUS_TRANSLATION[data.status.id] }}
                        </div>
                    </div>
                </template>
            </BaseDataTable>
        </BaseCard>

        <BaseDialog ref="reservationDialogRef" header="Resumen de la reserva">
            <template #default="{ data }">
                <ReservationSummary :reservation="(data as ReservationDataDialog)" />
            </template>
            <template #footer>
                <BaseButton label="Volver" severity="secondary" @click="reservationDialogRef.close"/>
            </template>
        </BaseDialog>
    </div>
</template>