import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email:'',
  phone:'',
  address:'',
  age:'',
  avatar:'',
  id:'',
  access_token:'',
  isAdmin: false,
  isTeacher:false
}

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser:(state,action)=>{
    const{name ='' , email ='' , phone ='' , _id ='' , address ='' , age ='' , avatar ='' , access_token ='',isTeacher,isAdmin }= action.payload
    state.name =name ;
    state.email =email;
    state.phone =phone;
    state.address =address;
    state.age =age;
    state.id =_id;
    state.isAdmin =isAdmin;
    state.isTeacher =isTeacher;
    state.avatar =avatar;
    state.access_token =access_token
    },
    resetUser:(state)=>{
        
        state.name ='';
        state.email ='';
        state.phone ='';
        state.address ='';
        state.age ='';
        state.id ='';
        state.avatar ='';
        state.access_token ='';
        }
    
  },
})

export const { updateUser ,resetUser } = userSlide.actions

export default userSlide.reducer