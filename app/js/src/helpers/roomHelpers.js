export function filterDataByRoom(data, filterValue) {
  if (!filterValue.size) {
    return data;
  }
  return data.filter((element) => filterValue.indexOf(element.get('location')) > -1);
}
