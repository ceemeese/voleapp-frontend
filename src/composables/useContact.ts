import { sendContactFormAction } from "@/modules/landing/actions/send-contact-form.action";
import type { ContactForm } from "@/modules/landing/interfaces";
import { ref } from "vue";

export const useContact = () => {
    const isLoading = ref(false);

    const sendContactForm = async(dataForm: ContactForm) : Promise<void> => {
        isLoading.value = true;
        
        try {
            await sendContactFormAction(dataForm);
        } finally {
            isLoading.value = false;
        }
    }


    return {
        sendContactForm,
    }
}