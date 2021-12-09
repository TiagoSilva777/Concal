document.querySelector('body').style.overflow = "hidden";
document.getElementById('prelaod').onwheel = function(e)
{
  e.preventDefault();
  return false;
}
function limpar_auto_load()
{
  document.getElementById('prelaod').style.visibility = "hidden";
  document.querySelector('body').style.overflow = "auto";
}
window.onload = function()
{
  window.setTimeout(limpar_auto_load, 1000*2);
}