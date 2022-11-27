import axios, { AxiosRequestConfig } from "axios"

const baseUrl = 'http://localhost:3001/api/'

export const get = (endpoint: string, options: AxiosRequestConfig<any>) => {
    return axios.get(baseUrl + endpoint, {...options})
}

export const post = (endpoint: string, options: AxiosRequestConfig<any>) => {
    return axios.post(baseUrl + endpoint, {...options})
}

export const put = (endpoint: string, options: AxiosRequestConfig<any>) => {
    return axios.put(baseUrl + endpoint, {...options})
}