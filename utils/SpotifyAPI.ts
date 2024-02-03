import axios, { Axios } from 'axios';

const URL = 'https://api.spotify.com/v1'

// spowalniacz do axiosa, potrzebne żeby nie przekroczyć limitu API
function scheduleRequests(axiosInstance, intervalMs, ) {
  let lastInvocationTime: number | undefined = undefined;

  const scheduler = (config) => {
    const now = Date.now();
    if (lastInvocationTime) {
      lastInvocationTime += intervalMs;
      const waitPeriodForThisRequest = lastInvocationTime - now;
      if (waitPeriodForThisRequest > 0) {
        return new Promise((resolve) => {
          setTimeout(
            () => resolve(config),
            waitPeriodForThisRequest);
        });
      }
    }

    lastInvocationTime = now;
    return config;
  }

  axiosInstance.interceptors.request.use(scheduler);

  return axiosInstance
}

interface Spoxios {
  axios: Axios
  setToken: (token: string) => void
}

// instancja axiosa z różnymi przydatnymi dekoratorami
export const spoxios: Spoxios = {
  axios: scheduleRequests(axios.create({ baseURL: URL, }), 100),
  setToken:  function (token: string) {
    this.axios.interceptors.request.use(function(config) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    })
  },
}

export default spoxios;
