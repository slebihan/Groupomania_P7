import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
const axios = require("axios");

export default function Signup() {

  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  };

  const onSubmit = (values) => {
    axios.post("http://localhost:3000/api/register", values)
    .then(
      (res) =>
        alert(
          "Votre inscription a bien été enregistrée ! Rendez-vous dans la section Login pour vous connecter"
        )
      
    ).catch(err=>alert('Merci de vérifier les informations enregistrées'))
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Ce champ est requis")
      .matches(
        /^.+(@groupomania.fr$)/,
        "l'email doit être au format @groupomania.fr"
      ),

    password: Yup.string()
      .required("Ce champ est requis")
      .matches(
        /(?=.{8,15}$)(?:[A-Z]{1,})([a-z]{1,})(?:.*[0-9]{1,3})(?:.*[+@=*&$-]{0,1})./,
        "Le mot de passe est de 8 à 15 caractères, doit contenir une majuscule,une minuscule,un chiffre et un caractère spécial (+@=*&$-)"
      ),
  });

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="input-container">
        <label htmlFor="firstname">Prénom </label>
        <input
          id="firstname"
          name="firstname"
          type="text"
          placeholder="First Name"
          onChange={formik.handleChange}
          value={formik.values.firstname || ""}
        />
      </div>

      <div className="input-container">
        <label htmlFor="Nom">Nom </label>
        <input
          id="lastname"
          name="lastname"
          type="text"
          placeholder="Last Name"
          onChange={formik.handleChange}
          value={formik.values.lastname || ""}
        />
      </div>

      <div className="input-container">
        <label htmlFor="Email">Email </label>
        <input
          id="email-signup"
          name="email"
          type="email"
          placeholder="Email"
          onChange={formik.handleChange}
          value={formik.values.email || ""}
        />
        {formik.errors.email && formik.touched.email &&
          <div>{formik.errors.email}</div>
        }
      </div>

      <div className="input-container">
        <label htmlFor="Password">Password </label>
        <input
          id="password-signup"
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="off"
          onChange={formik.handleChange}
          value={formik.values.password || ""}
        />
        {formik.errors.password && formik.touched.password ? (
          <div>{formik.errors.password}</div>
        ) : null}
      </div>
      <button type="submit" aria-label="s'inscrire">S'inscrire</button>
    </form>
  );
}
