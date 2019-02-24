export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;
export const defaultMenuType = 'menu-default'; //'menu-sub-hidden', 'menu-hidden'
export const defaultStartPath = '/app/projects/edit';

export const defaultLocale = 'en';
export const localeOptions = [
	{ id: 'en', name: 'English' },
	{ id: 'es', name: 'Español' },
	{ id: 'pt', name: 'Portugues' },
];

export const firebaseConfig = {
	apiKey: process.env.API_KEY,
	authDomain: process.env.AUTH_DOMAIN,
	databaseURL: process.env.DATABASE_URL,
	projectId: process.env.PROJECT_ID,
	storageBucket: process.env.STORAGE_BUCKET,
	messagingSenderId: process.env.MESSAGING_SENDER_ID,
};

export const apiUrl = 'http://localhost:9000/api/';

export const searchPath = '/app/projects/edit';
