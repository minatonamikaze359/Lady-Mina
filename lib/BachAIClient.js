/**
 * Creator: @Paxsenix0 (Alex)
 * Base: https://play.google.com/store/apps/details?id=ai.music.maker.songs.creator.audio.mp3.melody.instrumentals.dj
 * DO NOT REUPLOAD OR REPOST THIS SCRAPE WITHOUT CREDIT/SOURCE TO ORIGINAL POST.
 */

const axios = require("axios");
const crypto = require("crypto");
const FormData = require("form-data");

class BachAIClient {
  constructor() {
    this.baseUrl = "https://bach-ai.top/api";
    this.secret = "VLvbT##*8oQ6JgUwg@wciD";
    this.maxPollingAttempts = 60;
    this.pollingIntervalMs = 4000;
    
    this.endpoints = {
      generate: "/generate",
      task: (id) => `/result/${id}`
    };
    
    this.appInfo = {
      name: "Bach AI",
      version: "1.0.2",
      osName: "Android",
      osVersion: "13",
      deviceModel: "Pixel 7"
    };
  }

  getCurrentUTCHour() {
    return new Date().getUTCHours().toString();
  }

  getUserAgent() {
    const { name, version, osName, osVersion, deviceModel } = this.appInfo;
    return `${name}/${version} (${osName}; ${osVersion}; ${deviceModel})`;
  }

  generateApiKey() {
    const userAgent = this.getUserAgent();
    const utcHour = this.getCurrentUTCHour();
    const message = `${userAgent}|${utcHour}`;

    try {
      const hmac = crypto.createHmac("sha256", Buffer.from(this.secret, "utf-8"));
      hmac.update(Buffer.from(message, "utf-8"));
      return hmac.digest("hex");
    } catch (error) {
      console.error("Error generating API key:", error);
      throw new Error("Failed to generate API key");
    }
  }

  createHeaders(deviceId, userAgent, apiKey, isFormData = false) {
    const headers = {
      'User-Agent': userAgent || this.getUserAgent(), // Fallback if undefined
      'x-api-key': apiKey || this.generateApiKey(), // Fallback if undefined
      'device-id': deviceId || crypto.randomUUID() // Fallback if undefined
    };

    if (isFormData) {
      headers['Content-Type'] = 'multipart/form-data';
    }

    return headers;
  }

  createFormData(options) {
    const { 
      customMode = false, 
      prompt, 
      title, 
      style, 
      instrumental = false 
    } = options || {};
    const form = new FormData();

    if (!prompt) throw new Error("Prompt is required");
    form.append('mode', customMode ? 'custom' : 'default');
    form.append('prompt', prompt);
    form.append('isInstrumental', instrumental.toString());

    if (customMode) {
      if (title) form.append('title', title);
      form.append('gpt_prompt', `Generate the music.`);
      if (style) form.append('tags', JSON.stringify(style.split(' ')));
    }

    return form;
  }

  async pollTask({ id, deviceId, userAgent, apiKey }) {
    console.log(`Starting to poll task: ${id}`);

    for (let attempt = 1; attempt <= this.maxPollingAttempts; attempt++) {
      try {
        const url = `${this.baseUrl}${this.endpoints.task(id)}`;
        const headers = this.createHeaders(deviceId, userAgent, apiKey);

        const response = await axios.get(url, {
          headers,
          validateStatus: () => true
        });

        const data = response.data;
        console.log(`Polling attempt ${attempt}:`, data); // Log response for debugging

        if (!data || typeof data !== 'object') {
          throw new Error("Invalid API response during polling");
        }

        if (!data.success) {
          throw new Error(`Task polling failed: ${data.message || 'Unknown error'}`);
        }

        const status = data?.data?.status;
        if (!status) {
          throw new Error("No status found in polling response");
        }

        const isCompleted = status !== 'pending';
        if (isCompleted) {
          console.log('Task completed successfully');
          return data.data?.tracks || data.data; // Return tracks or full data if tracks is undefined
        }

        if (attempt < this.maxPollingAttempts) {
          console.log(`Task still pending, waiting ${this.pollingIntervalMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, this.pollingIntervalMs));
        }
      } catch (error) {
        console.error(`Polling attempt ${attempt} failed:`, error.message);
        if (attempt === this.maxPollingAttempts) throw error;
      }
    }

    throw new Error(`Task polling timeout: Maximum ${this.maxPollingAttempts} attempts reached`);
  }

  async generate(options = {}) {
    const {
      customMode = false,
      prompt,
      title = "",
      style = "",
      instrumental = false
    } = options;

    if (!prompt) {
      throw new Error("Prompt is required");
    }

    try {
      const deviceId = crypto.randomUUID();
      const userAgent = this.getUserAgent();
      const apiKey = this.generateApiKey();

      console.log('Generating song with:', { deviceId, userAgent, apiKey });

      const form = this.createFormData(options);
      const headers = this.createHeaders(deviceId, userAgent, apiKey, true);
      const url = `${this.baseUrl}${this.endpoints.generate}`;

      const response = await axios.post(url, form, { headers, validateStatus: () => true });
      const data = response.data;

      console.log('Generation response:', data);

      if (!data || typeof data !== 'object') {
        throw new Error("Invalid API response format");
      }

      if (!data.success) {
        throw new Error(`Generation failed: ${data.message || 'Unknown error'}`);
      }

      const jobId = data.data?.job_id;
      if (!jobId) {
        throw new Error('No job ID returned from generation request');
      }

      return await this.pollTask({
        id: jobId,
        deviceId,
        userAgent,
        apiKey
      });
    } catch (error) {
      console.error('Generation failed:', error.message);
      throw error;
    }
  }
}

module.exports = { BachAIClient };