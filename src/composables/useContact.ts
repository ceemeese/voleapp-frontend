import { sendContactFormAction } from "@/modules/landing/actions/send-contact-form.action";
import type { ContactForm } from "@/modules/landing/interfaces";

export const useContact = () => {

    const sendContactForm = (dataForm: ContactForm) : Promise<void> => {
        return sendContactFormAction(dataForm);
    }


    return {
        sendContactForm,
    }
}