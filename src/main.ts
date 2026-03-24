import { createApp } from 'vue'
import { plugins } from './plugins/index'
import PrimeVue from 'primevue/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import UILibrary from 'ui';

import router from './router'

import './assets/main.css'
import 'primeicons/primeicons.css';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';


import "ui/style.css"



import App from './App.vue'


const app = createApp(App)

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{teal.50}',
            100: '{teal.100}',
            200: '{teal.200}',
            300: '{teal.300}',
            400: '{teal.400}',
            500: '{teal.500}',
            600: '{teal.600}',
            700: '{teal.700}',
            800: '{teal.800}',
            900: '{teal.900}',
            950: '{teal.950}',
            color: '{primary.500}',
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '{slate.50}',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    600: '{slate.600}',
                    700: '{slate.700}',
                    800: '{slate.800}',
                    900: '{slate.900}',
                    950: '{slate.950}'
                },
                highlight: {
                    background: '{primary.50}',
                    color: '{primary.700}',
                }
            },
            dark: {
                surface: {
                    0: '#18181b',
                    50: '{zinc.50}',
                    100: '{zinc.100}',
                    200: '{zinc.200}',
                    300: '{zinc.300}',
                    400: '{zinc.400}',
                    500: '{zinc.500}',
                    600: '{zinc.600}',
                    700: '{zinc.700}',
                    800: '{zinc.800}',
                    900: '{zinc.900}',
                    950: '{zinc.950}'
                },
                highlight: {
                    background: '{primary.200}',
                    color: '{primary.900}',
                }
            },
        },
    }
});


app.use(PrimeVue, {
            theme: {
                preset: MyPreset,
                options: {
                    darkModeSelector: false,
                    cssLayer: false,
                }
            }
        });

app.use(UILibrary)
plugins(app);
app.use(router)
app.use(ConfirmationService);
app.use(ToastService);

app.mount('#app')


