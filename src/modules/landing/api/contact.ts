import type { AxiosRequestConfig } from "axios";
import type { ContactForm } from "../interfaces";

const baseURL = "api/support"

function sendContactFormMessage(data: ContactForm) : AxiosRequestConfig {
    return {
        method: 'POST',
        url: `${baseURL}/contact`,
        data: data
    }

}

export default {
    sendContactFormMessage,
}