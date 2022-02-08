var os;
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
  // true for mobile device
  os = "mobile"
}else{
  // false for not mobile device
 os = "web"
}