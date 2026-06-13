import { deleteEventAction, getEventByIdAction, getEventsRangeByClubAction, getEventsRangeByCourtAction, registerEventAction, updateEventAction } from "@/modules/club/actions";
import { ref } from "vue";
import type { AddEvent, Event, PutEvent } from "@/modules/club/interfaces"

export const useEvent = () => {
    const isLoading = ref<boolean>(false);

    const getEventsRangeByCourt = async (courtId: string, startRange: Date, endRange?: Date) :Promise<Event[]> => {
        
        
        try {
            const data: Event[] = await getEventsRangeByCourtAction(courtId, startRange, endRange);
            return data;
        } finally {
            
        }
    }
    
    const getEventsRangeByClub = async (clubId: string, startRange: Date, endRange?: Date) :Promise<Event[]> => {
        
        
        try {
            const data: Event[] = await getEventsRangeByClubAction(clubId, startRange, endRange)
            return data;
        } finally {
            
        }
    }

    const getEventById = async (courtId: string, eventId: number) :Promise<Event> => {
        
        
        try {
            const data: Event = await getEventByIdAction(courtId, eventId);
            return data;
        } finally {
            
        }
    }

    const createEvent = async (courtId: string, dataForm: AddEvent) :Promise<Event> => {
        
        
        try {
            const data: Event = await registerEventAction(courtId, dataForm);
            return data;
        } finally {
            
        }
    }

    const updateEvent = async (courtId: string, eventId: number, dataForm: PutEvent) :Promise<Event> => {
        
        
        try {
            const data: Event = await updateEventAction(courtId, eventId, dataForm);
            return data;
        } finally {
            
        }
    }

    const deleteEvent = async (courtId: string, eventId: number) :Promise<void> => {
        
        
        try {
            await deleteEventAction(courtId, eventId);
        } finally {
            
        }
    }


    return {
        getEventsRangeByClub,
        getEventsRangeByCourt,
        getEventById,
        createEvent,
        updateEvent,
        deleteEvent,
        isLoading
    }
}