const baseURL = import.meta.env.VITE_API_BASE_URL || "";
const timeout = Number(import.meta.env.VITE_API_TIMEOUT || 10000);

function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.append(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function request(url, options = {}) {
  const { method = "GET", params, data, headers = {}, signal } = options;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeout);

  try {
    const isFormData = data instanceof FormData;
    const requestHeaders = {
      ...(isFormData ? {} : { "Content-Type": "application/x-www-form-urlencoded" }),
      ...headers,
    };

    const response = await fetch(`${baseURL}${url}${buildQueryString(params)}`, {
      method,
      headers: requestHeaders,
      body: data ? (isFormData ? data : new URLSearchParams(data)) : undefined,
      signal: signal || controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } finally {
    window.clearTimeout(timer);
  }
}

export function get(url, params, options = {}) {
  return request(url, {
    ...options,
    method: "GET",
    params,
  });
}

export function post(url, data, options = {}) {
  return request(url, {
    ...options,
    method: "POST",
    data,
  });
}

export function uploadFile(url, file, fieldName = "file", extraData = {}, options = {}) {
  const formData = new FormData();
  formData.append(fieldName, file);

  Object.entries(extraData).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    formData.append(key, value);
  });

  return request(url, {
    ...options,
    method: "POST",
    data: formData,
  });
}
