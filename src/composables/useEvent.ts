import { deleteEventAction, getEventByIdAction, getEventsRangeByClubAction, getEventsRangeByCourtAction, registerEventAction, updateEventAction } from "@/modules/club/actions";
import type { AddEvent, Event, PutEvent } from "@/modules/club/interfaces"

export const useEvent = () => {

    const getEventsRangeByCourt = (courtId: string, startRange: Date, endRange?: Date) :Promise<Event[]> => {
        return getEventsRangeByCourtAction(courtId, startRange, endRange);
    }
    
    const getEventsRangeByClub = (clubId: string, startRange: Date, endRange?: Date) :Promise<Event[]> => { 
        return getEventsRangeByClubAction(clubId, startRange, endRange)
    }

    const getEventById = (courtId: string, eventId: number) :Promise<Event> => {
        return getEventByIdAction(courtId, eventId);
    }

    const createEvent = (courtId: string, dataForm: AddEvent) :Promise<Event> => {
        return registerEventAction(courtId, dataForm);
    }

    const updateEvent = (courtId: string, eventId: number, dataForm: PutEvent) :Promise<Event> => {
        return updateEventAction(courtId, eventId, dataForm);
    }

    const deleteEvent = (courtId: string, eventId: number) :Promise<void> => {
        return deleteEventAction(courtId, eventId);
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