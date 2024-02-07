JsonConfig2.prototype._loadJsonFile = function () {
    var jsonString = "";
    console.log("hello");
    var contentJsonConfig =
        process.env["APPLICATIONINSIGHTS_CONFIGURATION_CONTENT"];
    if (contentJsonConfig) {
        jsonString = contentJsonConfig;
    } else {
        var configFileName = "applicationinsights.json";
        var rootPath = path$2.join(__dirname, "../../");
        var tempDir = path$2.join(rootPath, configFileName);
        var configFile = process.env[ENV_CONFIGURATION_FILE];
        if (configFile) {
            if (path$2.isAbsolute(configFile)) {
                tempDir = configFile;
            } else {
                tempDir = path$2.join(rootPath, configFile);
            }
        }
        try {
            jsonString = fs$3.readFileSync(tempDir, "utf8");
        } catch (err) {
            Logging$l.warn("Failed to read JSON config file: ", err);
        }
    }
    try {
        var jsonConfig = JSON.parse(jsonString);
        if (jsonConfig.disableStatsbeat != void 0) {
            this.disableStatsbeat = jsonConfig.disableStatsbeat;
        }
        if (jsonConfig.disableAllExtendedMetrics != void 0) {
            this.disableAllExtendedMetrics = jsonConfig.disableStatsbeat;
        }
        if (jsonConfig.noDiagnosticChannel != void 0) {
            this.noDiagnosticChannel = jsonConfig.noDiagnosticChannel;
        }
        if (jsonConfig.noHttpAgentKeepAlive != void 0) {
            this.noHttpAgentKeepAlive = jsonConfig.noHttpAgentKeepAlive;
        }
        if (jsonConfig.connectionString != void 0) {
            this.connectionString = jsonConfig.connectionString;
        }
        if (jsonConfig.extendedMetricDisablers != void 0) {
            this.extendedMetricDisablers = jsonConfig.extendedMetricDisablers;
        }
        if (jsonConfig.noDiagnosticChannel != void 0) {
            this.noDiagnosticChannel = jsonConfig.noDiagnosticChannel;
        }
        if (jsonConfig.proxyHttpUrl != void 0) {
            this.proxyHttpUrl = jsonConfig.proxyHttpUrl;
        }
        if (jsonConfig.proxyHttpsUrl != void 0) {
            this.proxyHttpsUrl = jsonConfig.proxyHttpsUrl;
        }
        if (jsonConfig.proxyHttpsUrl != void 0) {
            this.proxyHttpsUrl = jsonConfig.proxyHttpsUrl;
        }
        if (jsonConfig.noPatchModules != void 0) {
            this.noPatchModules = jsonConfig.noPatchModules;
        }
        if (jsonConfig.enableAutoWebSnippetInjection != void 0) {
            this.enableWebInstrumentation =
                jsonConfig.enableAutoWebSnippetInjection;
            this.enableAutoWebSnippetInjection = this.enableWebInstrumentation;
        }
        if (jsonConfig.enableWebInstrumentation != void 0) {
            this.enableWebInstrumentation = jsonConfig.enableWebInstrumentation;
            this.enableAutoWebSnippetInjection = this.enableWebInstrumentation;
        }
        if (jsonConfig.webSnippetConnectionString != void 0) {
            this.webInstrumentationConnectionString =
                jsonConfig.webSnippetConnectionString;
            this.webSnippetConnectionString =
                this.webInstrumentationConnectionString;
        }
        if (jsonConfig.webInstrumentationConnectionString != void 0) {
            this.webInstrumentationConnectionString =
                jsonConfig.webInstrumentationConnectionString;
            this.webSnippetConnectionString =
                this.webInstrumentationConnectionString;
        }
        if (jsonConfig.webInstrumentationConfig != void 0) {
            this.webInstrumentationConfig = jsonConfig.webInstrumentationConfig;
        }
        if (jsonConfig.webInstrumentationSrc != void 0) {
            this.webInstrumentationSrc = jsonConfig.webInstrumentationSrc;
        }
        if (jsonConfig.enableLoggerErrorToTrace != void 0) {
            this.enableLoggerErrorToTrace = jsonConfig.enableLoggerErrorToTrace;
        }
        this.endpointUrl = jsonConfig.endpointUrl;
        this.maxBatchSize = jsonConfig.maxBatchSize;
        this.maxBatchIntervalMs = jsonConfig.maxBatchIntervalMs;
        this.disableAppInsights = jsonConfig.disableAppInsights;
        this.samplingPercentage = jsonConfig.samplingPercentage;
        this.correlationIdRetryIntervalMs =
            jsonConfig.correlationIdRetryIntervalMs;
        this.correlationHeaderExcludedDomains =
            jsonConfig.correlationHeaderExcludedDomains;
        this.ignoreLegacyHeaders = jsonConfig.ignoreLegacyHeaders;
        this.distributedTracingMode = jsonConfig.distributedTracingMode;
        this.enableAutoCollectExternalLoggers =
            jsonConfig.enableAutoCollectExternalLoggers;
        this.enableAutoCollectConsole = jsonConfig.enableAutoCollectConsole;
        this.enableLoggerErrorToTrace = jsonConfig.enableLoggerErrorToTrace;
        this.enableAutoCollectExceptions =
            jsonConfig.enableAutoCollectExceptions;
        this.enableAutoCollectPerformance =
            jsonConfig.enableAutoCollectPerformance;
        this.enableAutoCollectExtendedMetrics =
            jsonConfig.enableAutoCollectExtendedMetrics;
        this.enableAutoCollectPreAggregatedMetrics =
            jsonConfig.enableAutoCollectPreAggregatedMetrics;
        this.enableAutoCollectHeartbeat = jsonConfig.enableAutoCollectHeartbeat;
        this.enableAutoCollectRequests = jsonConfig.enableAutoCollectRequests;
        this.enableAutoCollectDependencies =
            jsonConfig.enableAutoCollectDependencies;
        this.enableAutoDependencyCorrelation =
            jsonConfig.enableAutoDependencyCorrelation;
        this.enableAutoCollectIncomingRequestAzureFunctions =
            jsonConfig.enableAutoCollectIncomingRequestAzureFunctions;
        this.enableUseAsyncHooks = jsonConfig.enableUseAsyncHooks;
        this.enableUseDiskRetryCaching = jsonConfig.enableUseDiskRetryCaching;
        this.enableResendInterval = jsonConfig.enableResendInterval;
        this.enableMaxBytesOnDisk = jsonConfig.enableMaxBytesOnDisk;
        this.enableInternalDebugLogging = jsonConfig.enableInternalDebugLogging;
        this.enableInternalWarningLogging =
            jsonConfig.enableInternalWarningLogging;
        this.enableSendLiveMetrics = jsonConfig.enableSendLiveMetrics;
        this.quickPulseHost = jsonConfig.quickPulseHost;
    } catch (err) {
        Logging$l.warn("Invalid JSON config file: ", err);
    }
};
