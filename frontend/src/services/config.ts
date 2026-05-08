export function getServiceUrl(location: Location) {
  let result = "";
  if (location.port === "3000") {
    result = "/rest/app";
  } else {
    result = "/ihpappbackend/rest/app";
  }
  return result;
}
