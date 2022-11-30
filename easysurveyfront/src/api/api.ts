import axios, { AxiosRequestConfig } from "axios"

const baseUrl = 'http://localhost:3001/api/'

export const get = (endpoint: string) => {
    if(!defaults.headers.Authorization) {
        defaults.headers.Authorization = "Bearer " + sessionStorage.getItem('@EasySurveys:token')
    }
    return axios.get(baseUrl + endpoint, {headers: {...defaults.headers}})
}

export const post = (endpoint: string, data: any) => {
    if(!defaults.headers.Authorization) {
        defaults.headers.Authorization = "Bearer " + sessionStorage.getItem('@EasySurveys:token')
    }
    return axios.post(baseUrl + endpoint, {...data}, {headers: {...defaults.headers}})
}

export const put = (endpoint: string, data: any) => {
    if(!defaults.headers.Authorization) {
        defaults.headers.Authorization = "Bearer " + sessionStorage.getItem('@EasySurveys:token')
    }
    return axios.put(baseUrl + endpoint, {...data}, {headers: {...defaults.headers}})
}

export const defaults = {
    headers: {
      Authorization: '',
    },
};