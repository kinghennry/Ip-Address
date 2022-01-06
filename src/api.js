export const findLocation = async ({ ip, domain, autoIp }) => {
  let params = "";

  if (domain) params = `&domain=${domain}`;
  else if (ip) params = `&ipAddress=${ip}`;
  else if (autoIp) params = "";
  else return null;

  // const endpoint = `https://geo.ipify.org/api/v1?apiKey=at_48k4XXo0ioV5Ie9p84efTUrhFKADd`
  //   const endpoint = `https://geo.ipify.org/api/v1?apiKey=at_EdB1PVRQjeFuAinoej0IDkCw6dzAQ${params}`;
  const endpoint = `https://geo.ipify.org/api/v1?apiKey=at_EdB1PVRQjeFuAinoej0IDkCw6dzAQ${params}`;
  const result = await fetch(endpoint);
  const json = await result.json();
  return json;
};
