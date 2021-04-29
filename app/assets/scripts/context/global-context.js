import React, { createContext, useState, useEffect } from 'react';
import T from 'prop-types';
import config from '../config';
import toasts from '../components/common/toasts';
const {
  apiEndpoint,
  rawDataDownloadTimeout,
  rawDataDownloadCheckInterval
} = config;

const GlobalContext = createContext({});

export function GlobalProvider(props) {
  // The user is restricted to one one download at a time, Object 'downloadTask'
  // keeps metadata of active download.
  const [download, setDownload] = useState(null);

  // Monitor download request by watching download object
  useEffect(() => {
    let clientDownloadId;
    let downloadUrl;
    if (download) {
      clientDownloadId = setInterval(() => {
        const duration = Date.now() - download.startedAt;
        if (duration > rawDataDownloadTimeout) {
          displayTimeoutError();
        } else {
          fetch(`${apiEndpoint}/export/status/${download.id}`).then(
            async (res) => {
              const { status, url } = await res.json();
              if (status === 'complete') {
                if (url) {
                  downloadUrl = url;
                  displaySuccess();
                } else {
                  displayUnknownError();
                }
              }
            }
          );
        }
      }, rawDataDownloadCheckInterval);
    }

    const displaySuccess = () => {
      toasts.info(
        `${download.prettyOperation} raw data export for ${download.selectedArea.name} has completed, click here to start download.`,
        {
          onClick: () => {
            window.open(downloadUrl, 'blank');
          }
        }
      );
      cleanup();
    };

    const displayTimeoutError = () => {
      toasts.error(
        `${download.prettyOperation} raw data export for ${download.selectedArea.name} has expired. Please try again later.`
      );
      cleanup();
    };

    const displayUnknownError = () => {
      toasts.error(
        `An unknown error occured in ${download.prettyOperation} raw data export for ${download.selectedArea.name}. Please try again later.`
      );
      cleanup();
    };

    const cleanup = () => {
      clearInterval(clientDownloadId);
    };

    // On every download change or app unmount, clean up setInterval
    return () => clientDownloadId && cleanup();
  }, [download]);

  return (
    <>
      <GlobalContext.Provider
        value={{
          setDownload
        }}
      >
        {props.children}
      </GlobalContext.Provider>
    </>
  );
}

GlobalProvider.propTypes = {
  children: T.array
};

export default GlobalContext;
