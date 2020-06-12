// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString = typeof str === 'undefined' ? localStorage.getItem('dqkkToken') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return authority;
  }
  return authority || '';
}

export function setAuthority(authority) {
  return localStorage.setItem('dqkkToken', authority);
}

export function goSubUrl(item, menuPermissionList) {
  if (menuPermissionList.includes(item.route) && item.url) {
    window.open(item.url + '?token=' + getAuthority());
  }
}
