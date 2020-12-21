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

export function GlobalProvider (props) {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    window.addEventListener('resize', () => {
      // Store the height to set the page min height. This is needed for mobile
      // devices to account for the address bar, since 100vh does not work.
      // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
      setWindowHeight(window.innerHeight);
    });
  }, []);

  // The user is restricted to one one download at a time, Object 'downloadTask'
  // keeps metadata of active download.
  const [download, setDownload] = useState(null);

  // Monitor download request by watching download object
  useEffect(() => {
    let clientDownloadId;
    if (download) {
      clientDownloadId = setInterval(() => {
        const duration = Date.now() - download.startedAt;
        console.log(
          `job ${clientDownloadId}: running for ${duration / 1000} s`
        );
        if (duration > rawDataDownloadTimeout) {
          displayTimeoutError();
        } else {
          fetch(`${apiEndpoint}/export/status/${download.id}`).then(
            async (res) => {
              const { status } = await res.json();
              if (status === 'complete') {
                console.log(status);
                displaySuccess();
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
            window.open(`${apiEndpoint}/export/${download.id}`, 'blank');
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
          windowHeight,
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
