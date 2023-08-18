import { transformUrl } from "unpic";

import type { LocalImageService, ExternalImageService, ImageTransform, ImageOutputFormat } from "astro";

import sharpService from "astro/assets/services/sharp";
import squooshService from "astro/assets/services/squoosh";

import { findImage } from '~/utils/images.ts'

const getInternalService = (key: string) => {
  return (key === "sharp" ? sharpService : squooshService) as LocalImageService;
};

const service: LocalImageService & ExternalImageService = {
  validateOptions(options: ImageTransform, serviceConfig) {
    console.log("~~~~~~~~~~ validateOptions()");
    console.log(options);

    const service = getInternalService(serviceConfig?.service);
    return typeof service?.validateOptions === "function" ? service.validateOptions(options, serviceConfig) : options;
  },

  parseURL(url: URL, serviceConfig) {
    const service = getInternalService(serviceConfig?.service);
    return service.parseURL(url, serviceConfig);
  },

  async transform(inputBuffer, transformOptions, serviceConfig) {
    const service = getInternalService(serviceConfig?.service);
    return service.transform(inputBuffer, transformOptions, serviceConfig);
  },

  async getURL(options, serviceConfig) {
    console.log("~~~~~~~~~~ getURL()");
    console.log(options);

    const url = await findImage(options.src);

    console.log("Genered URL: ", url);

    if (url && typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) {
      const generatedURL = transformUrl({
        url: url,
        width: options?.width,
        height: options?.height,
        format: options?.format,
      });

      console.log("REMOTE WORKER!!!");
      console.log("generated Url: ", String(generatedURL))

      console.log("~~~~~~~~~~~~~~~");

      return generatedURL ? String(generatedURL) : url;
    }

    if (url) {
      options.src = url;
    }

    const service = getInternalService(serviceConfig?.service);
    return service.getURL(options, serviceConfig);
  },

  getHTMLAttributes(options, serviceConfig) {
    console.log("~~~~~~~~~~ getHTMLAttributes()");
    console.log(options);

    const service = getInternalService(serviceConfig?.service);
    return typeof service?.getHTMLAttributes === "function" ? service.getHTMLAttributes(options, serviceConfig) : {};
  },
};

export default service;
