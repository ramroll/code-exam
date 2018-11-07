/**
 * 检查ua
 * @param userAgentInfo
 * @returns {boolean}
 * @constructor
 */
function IsPC(userAgentInfo) {
  var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

module.exports = IsPC
