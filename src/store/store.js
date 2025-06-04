import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import modulesReducer from './modulesSlice';
import myUserReducer from './myUserSlice';
import contentEditReducer from './contentEditSlice';
import lessonTypesReducer from './lessonTypesSlice';
import challengeReducer from './challengeSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        modules: modulesReducer,
        myUser: myUserReducer,
        contentEdit: contentEditReducer,
        lessonTypes: lessonTypesReducer,
        challenge: challengeReducer,
    },
});

export default store;