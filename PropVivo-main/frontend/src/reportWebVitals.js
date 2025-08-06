const reportWebVitals = (onPerfEntry, options = {}) => {
  // Check if performance tracking should be enabled
  if (process.env.NODE_ENV !== 'production' && !options.forceInDevelopment) {
    console.log('[Web Vitals] Performance tracking disabled in development');
    return;
  }

  // Validate the callback function
  if (!onPerfEntry || typeof onPerfEntry !== 'function') {
    console.error('[Web Vitals] No valid callback function provided');
    return;
  }

  // Dynamic import with error handling
  import('web-vitals')
    .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      try {
        // Core Web Vitals
        getCLS(onPerfEntry, { reportAllChanges: options.reportAllChanges });
        getFID(onPerfEntry);
        getLCP(onPerfEntry, { reportAllChanges: options.reportAllChanges });

        // Additional metrics
        if (options.includeExtendedMetrics) {
          getFCP(onPerfEntry);
          getTTFB(onPerfEntry);
        }

        console.log('[Web Vitals] Performance tracking initialized');
      } catch (error) {
        console.error('[Web Vitals] Error initializing metrics:', error);
      }
    })
    .catch(error => {
      console.error('[Web Vitals] Failed to load web-vitals package:', error);
    });
};

// Default export
export default reportWebVitals;

// Named exports for individual metrics
export const reportCLS = (onPerfEntry, options) => {
  import('web-vitals')
    .then(({ getCLS }) => getCLS(onPerfEntry, options))
    .catch(console.error);
};

export const reportFID = (onPerfEntry) => {
  import('web-vitals')
    .then(({ getFID }) => getFID(onPerfEntry))
    .catch(console.error);
};

export const reportLCP = (onPerfEntry, options) => {
  import('web-vitals')
    .then(({ getLCP }) => getLCP(onPerfEntry, options))
    .catch(console.error);
};
