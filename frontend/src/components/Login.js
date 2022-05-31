import React from "react";

import { useFormik} from "formik";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const axios = require('axios');
axios.default.withCredentials = true



export default function Login() {

    let navigate = useNavigate()

    const formik = useFormik({
        initialValues : {
            email : "" ,
            password : ""
        },
        validate : values => {
            let errors = {}

            if( values.email.length === 0 ){
                errors.email = "Ce champs est requis"
            }

            return errors},
        onSubmit : (values)=>{
            
            axios.post('http://localhost:3000/api/login',values,{withCredentials:true})
            .then((res)=>{
            
                Cookies.set('jwt',res.data.token,{secure:true})
                
                if(res.data.user.isAdmin){
                navigate('/UserProfile/Admin')}
                else{navigate(`/UserProfile/${res.data.userId}`)}
                

            }, (error) => {
                window.alert('Merci de vérifier les informations enregistrées')
            })
        },        

        
    })
    

        return (
            
                <form onSubmit={formik.handleSubmit} className="infos-1">
                <label htmlFor="email">Email </label>

                <input
                name="email"
                type="email"
                id="email"
                placeholder="Enter email"
                onChange={formik.handleChange}
                value={formik.values.email || ''}
              />
              { formik.errors.email ? <div>{ formik.errors.email }</div> : null }

                <label htmlFor="password">Password</label>
                <input 
                name="password"
                type="password"
                id="password"
                placeholder="Password"
                autoComplete="off"
                onChange={formik.handleChange}
                value={formik.values.password || ''}
                />
                <button type='submit' aria-label="Se Connecter">Se Connecter</button>
              </form>
              
        )
    };

