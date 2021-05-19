import { StorageService } from './StorageService.js';

const STORAGE_KEY = 'FETCH_SERVICE_REQUESTS';
const CACHE_DURATION = 300000; // Five minutes
let cachedRequests;

export const FetchService = {
  init() {
    const now = Date.now();
    cachedRequests = StorageService.getLocal(STORAGE_KEY);

    if (!Array.isArray(cachedRequests)) {
      cachedRequests = [];
    }

    cachedRequests = cachedRequests.filter(
      ({ expirationDate }) => expirationDate > now
    );

    StorageService.setLocal(STORAGE_KEY, cachedRequests);
  },

  getCachedJSON(url) {
    return new Promise((resolve, reject) => {
      const refreshData = () => {
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            const expirationDate = Date.now() + CACHE_DURATION;

            cachedRequests = cachedRequests
              .filter((request) => request.url !== url)
              .concat([{ url, expirationDate, data }]);

            StorageService.setLocal(STORAGE_KEY, cachedRequests);

            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      };

      try {
        const { expirationDate, data } =
          cachedRequests.find((request) => request.url === url) || {};

        if (expirationDate > Date.now()) {
          resolve(data);
        } else {
          refreshData();
        }
      } catch (error) {
        refreshData();
      }
    });
  },
};
