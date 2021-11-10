import substr from 'locutus/php/strings/substr'
import strlen from 'locutus/php/strings/strlen'
import date from 'locutus/php/datetime/date'
import mktime from 'locutus/php/datetime/mktime'

export function ztime(str) {
  if (!str) {
    return
  }

  var hour = 1 * substr(str, 8, 2)
  var min = 1 * substr(str, 10, 2)
  var sec = 1 * substr(str, 12, 2)
  var year = 1 * substr(str, 0, 4)
  var month = 1 * substr(str, 4, 2)
  var day = 1 * substr(str, 6, 2)
  if (strlen(str) <= 8) {
    var gap = 0
  } else {
    gap = zgap()
  }

  return mktime(hour, min, sec, month || 1, day || 1, year) + gap
}

export function zgap() {
  var time_zone = date('O')
  if (time_zone * 1 < 0) {
    var to = -1
  } else {
    to = 1
  }

  var t_hour = 1 * substr(time_zone, 1, 2) * to
  var t_min = 1 * substr(time_zone, 3, 2) * to

  var server_time_zone = '+0900'
  if (server_time_zone * 1 < 0) {
    var so = -1
  } else {
    so = 1
  }

  var c_hour = 1 * substr(server_time_zone, 1, 2) * so
  var c_min = 1 * substr(server_time_zone, 3, 2) * so

  var g_min = t_min - c_min
  var g_hour = t_hour - c_hour

  var gap = g_min * 60 + g_hour * 60 * 60
  return gap
}
