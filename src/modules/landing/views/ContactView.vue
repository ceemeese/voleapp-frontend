<script setup lang="ts">
import type { ContactForm } from '../interfaces';

const { sendContactForm } = useContact();
const toast = useToast();

const form = ref<ContactForm>({
    name: '',
    email: '',
    message: ''
});

const handleSubmit = async () => {
    try {
        await sendContactForm(form.value);
        toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Mensaje enviado', life: 2000 });
    } catch (error: unknown){
        const message = error instanceof Error ? error.message : 'Error inesperado';
        toast.add({ severity: 'error', summary: 'Error al cambiar estado', detail: message, life: 2000 });
    }
};

</script>

<template>

    <section class="w-full bg-white pt-32 sm:pt-40 pb-24 px-6">
        <div class="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
            
            <div class="md:col-span-5 space-y-12">
                <div class="space-y-3">
                    <h1 class="text-3xl font-black text-slate-950 tracking-tight">
                        Contacto directo
                    </h1>
                    <p class="text-sm text-slate-500 leading-relaxed max-w-sm">
                        Escríbenos a través del formulario o utiliza directamente nuestras direcciones de correo según tu perfil
                    </p>
                </div>

                <div class="space-y-6 border-t border-slate-100 pt-8">
                    <div class="space-y-1">
                        <span class="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Soporte Jugadores</span>
                        <p class="text-base font-bold text-slate-900 font-mono">soporte@vole-app.com</p>
                    </div>
                    
                    <div class="space-y-1">
                        <span class="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Gestión de Clubes</span>
                        <p class="text-base font-bold text-slate-900 font-mono">clubes@vole-app.com</p>
                    </div>
                </div>
            </div>

            <div class="md:col-span-7 md:pt-2">
                <form @submit.prevent="handleSubmit" class="space-y-8">
                    
                    <div class="border-b border-slate-200 focus-within:border-slate-900 transition-all pb-2">
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nombre o Club</label>
                        <input 
                            v-model="form.name"
                            type="text" 
                            required
                            placeholder="Tu nombre..."
                            class="w-full bg-transparent py-2 text-sm font-bold text-slate-900 placeholder-slate-300 focus:outline-none"
                        />
                    </div>

                    <div class="border-b border-slate-200 focus-within:border-slate-900 transition-all pb-2">
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Correo electrónico</label>
                        <input 
                            v-model="form.email"
                            type="email" 
                            required
                            placeholder="nombre@dominio.com"
                            class="w-full bg-transparent py-2 text-sm font-bold text-slate-900 placeholder-slate-300 focus:outline-none"
                        />
                    </div>

                    <div class="border-b border-slate-200 focus-within:border-slate-900 transition-all pb-2">
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Mensaje</label>
                        <textarea 
                            v-model="form.message"
                            rows="4" 
                            required
                            placeholder="¿En qué te podemos ayudar?"
                            class="w-full bg-transparent py-2 text-sm font-bold text-slate-900 placeholder-slate-300 focus:outline-none resize-none"
                        ></textarea>
                    </div>

                    <div class="pt-4 flex justify-end">
                        <BaseButton            
                            rounded
                            label='Enviar mensaje'
                            type="submit"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                            class="!px-8 !py-4 !text-white !bg-slate-900 !font-bold shadow-none hover:!bg-slate-800 transition-all !border-none w-full sm:w-auto"
                        />
                    </div>

                </form>
            </div>

        </div>
    </section>
</template>