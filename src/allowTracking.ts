const allowTracking =
  window.location.host === 'meme.teahouse.team' ||
  window.location.host === 'meme.wd-ljt.com'
    ? true
    : false

export default allowTracking
