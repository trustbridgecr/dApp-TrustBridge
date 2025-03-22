import { gql } from "graphql-request";
import { graphqlClient } from "./graphql-client";


interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  login?: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

interface RegisterResponse {
  register: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}


export async function loginUser(data: LoginData) {
  const mutation = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          id
          name
          email
        }
      }
    }
  `;

  try {
    const response = await graphqlClient.request<LoginResponse>(mutation, {
      email: data.email,
      password: data.password,
    });

    if (response.login?.token) {
      localStorage.setItem("authToken", response.login.token);
      return response.login;
    }

    throw new Error("Credenciales inválidas");
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
}


export async function registerUser(data: RegisterData) {
  const mutation = gql`
    mutation Register($name: String!, $email: String!, $password: String!) {
      register(name: $name, email: $email, password: $password) {
        token
        user {
          id
          name
          email
        }
      }
    }
  `;

  try {
    const response = await graphqlClient.request<RegisterResponse>(mutation, {
      name: data.name,
      email: data.email,
      password: data.password,
    });

    return response.register;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
}


export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("authToken");
}


export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authToken");
  window.location.href = "/";
}
