import { deleteEventAction, getEventByIdAction, getEventsRangeByClubAction, getEventsRangeByCourtAction, registerEventAction, updateEventAction } from "@/modules/club/actions";
import { ref } from "vue";
import type { AddEvent, Event, PutEvent } from "@/modules/club/interfaces"

export const useEvent = () => {
    const isLoading = ref(false);

    const getEventsRangeByCourt = async (courtId: string, startRange: Date, endRange?: Date) :Promise<Event[]> => {
        isLoading.value = true;
        
        try {
            const data: Event[] = await getEventsRangeByCourtAction(courtId, startRange, endRange);
            return data;
        } finally {
            isLoading.value = false;
        }
    }
    
    const getEventsRangeByClub = async (clubId: string, startRange: Date, endRange?: Date) :Promise<Event[]> => {
        isLoading.value = true;
        
        try {
            const data: Event[] = await getEventsRangeByClubAction(clubId, startRange, endRange)
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const getEventById = async (courtId: string, eventId: number) :Promise<Event> => {
        isLoading.value = true;
        
        try {
            const data: Event = await getEventByIdAction(courtId, eventId);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const createEvent = async (courtId: string, dataForm: AddEvent) :Promise<number> => {
        isLoading.value = true;
        
        try {
            const data: number = await registerEventAction(courtId, dataForm);
            return data;
        } finally {
            isLoading.value = false;
        }
    }

    const updateEvent = async (courtId: string, eventId: number, dataForm: PutEvent) :Promise<void> => {
        isLoading.value = true;
        
        try {
            await updateEventAction(courtId, eventId, dataForm);
        } finally {
            isLoading.value = false;
        }
    }

    const deleteEvent = async (courtId: string, eventId: number) :Promise<void> => {
        isLoading.value = true;
        
        try {
            await deleteEventAction(courtId, eventId);
        } finally {
            isLoading.value = false;
        }
    }


    return {
        getEventsRangeByClub,
        getEventsRangeByCourt,
        getEventById,
        createEvent,
        updateEvent,
        deleteEvent,
    }
}