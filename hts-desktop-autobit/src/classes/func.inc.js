var php = require('phpjs');
var funcs = (function () {

    /**
     * YYYYMMDDHHIISS format changed to unix time value
     *
     * @param string $str Time value in format of YYYYMMDDHHIISS
     * @return int
     */
    function ztime(str) {
        if(!str) {
            return;
        }

        var hour = 1 * php.substr(str, 8, 2);
        var min = 1 * php.substr(str, 10, 2);
        var sec = 1 * php.substr(str, 12, 2);
        var year = 1 * php.substr(str, 0, 4);
        var month = 1 * php.substr(str, 4, 2);
        var day = 1 * php.substr(str, 6, 2);
        if(php.strlen(str) <= 8) {
            var gap = 0;
        } else {
            gap = zgap();
        }

        return php.mktime(hour, min, sec, month || 1, day || 1, year) + gap;
    }

    /**
     * Get a time gap between server's timezone and XE's timezone
     *
     * @return int
     */
    function zgap() {
        var time_zone = '+0900';
        if(time_zone * 1 < 0) {
            var to = -1;
        } else {
            to = 1;
        }

        var t_hour = 1 * php.substr(time_zone, 1, 2) * to;
        var t_min = 1 * php.substr(time_zone, 3, 2) * to;

        var server_time_zone = php.date('O');
        if(server_time_zone * 1 < 0) {
            var so = -1;
        } else {
            so = 1;
        }

        var c_hour = 1 * php.substr(server_time_zone, 1, 2) * so;
        var c_min = 1 * php.substr(server_time_zone, 3, 2) * so;

        var g_min = t_min - c_min;
        var g_hour = t_hour - c_hour;

        var gap = g_min * 60 + g_hour * 60 * 60;
        return gap;
    }

    /**
     * Name of the month return
     *
     * @param int $month Month
     * @param boot $short If set, returns short string
     * @return string
     */
    function getMonthName(month, short) {
        if(typeof short === 'undefined') {
            short = true;
        }

        var short_month = {
            0: '',
            1: 'Jan',
            2: 'Feb',
            3: 'Mar',
            4: 'Apr',
            5: 'May',
            6: 'Jun',
            7: 'Jul',
            8: 'Aug',
            9: 'Sep',
            10: 'Oct',
            11: 'Nov',
            12: 'Dec'
        };
        var long_month = {
            0: '',
            1: 'January',
            2: 'February',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December'
        };
        return !short ? long_month[month] : short_month[month];
    }

    /**
     * Change the time format YYYYMMDDHHIISS to the user defined format
     *
     * @param string|int $str YYYYMMDDHHIISS format time values
     * @param string $format Time format of php date() function
     * @param bool $conversion Means whether to convert automatically according to the language
     * @return string
     */
    function zdate(str, format, conversion) {
        if(typeof format === 'undefined') {
            format = 'Y-m-d H:i:s';
        }

        if(typeof conversion === 'undefined') {
            conversion = true;
        }

        // return null if no target time is specified
        if(!str) {
            return;
        }
        /* // convert the date format according to the language
        if(conversion == true)
        {
            switch(Context.getLangType())
            {
                case 'en' :
                case 'es' :
                    if(format == 'Y-m-d')
                    {
                        format = 'M d, Y';
                    }
                    else if(format == 'Y-m-d H:i:s')
                    {
                        format = 'M d, Y H:i:s';
                    }
                    else if(format == 'Y-m-d H:i')
                    {
                        format = 'M d, Y H:i';
                    }
                    break;
                case 'vi' :
                    if(format == 'Y-m-d')
                    {
                        format = 'd-m-Y';
                    }
                    else if(format == 'Y-m-d H:i:s')
                    {
                        format = 'H:i:s d-m-Y';
                    }
                    else if(format == 'Y-m-d H:i')
                    {
                        format = 'H:i d-m-Y';
                    }
                    break;
            }
        } */

        // If year value is less than 1970, handle it separately.
        if(php.substr(str, 0, 4) * 1 < 1970) {
            var hour = php.substr(str, 8, 2) * 1;
            var min = php.substr(str, 10, 2) * 1;
            var sec = php.substr(str, 12, 2) * 1;
            var year = php.substr(str, 0, 4) * 1;
            var month = php.substr(str, 4, 2) * 1;
            var day = php.substr(str, 6, 2) * 1;

            var trans = {
                'Y': year,
                'y': php.sprintf('%02d', year % 100),
                'm': php.sprintf('%02d', month),
                'n': month,
                'd': php.sprintf('%02d', day),
                'j': day,
                'G': hour,
                'H': php.sprintf('%02d', hour),
                'g': hour % 12,
                'h': php.sprintf('%02d', hour % 12),
                'i': php.sprintf('%02d', min),
                's': php.sprintf('%02d', sec),
                'M': getMonthName(month),
                'F': getMonthName(month, false)
            };

            var string = php.strtr(format, trans);
        } else {
            // if year value is greater than 1970, get unixtime by using ztime() for date() function's argument.
            string = php.date(format, ztime(str));
        }
        // change day and am/pm for each language
        var unit_week = ['월', '화', '수', '목', '금', '토', '일'];
        var unit_meridiem = ['오전', '오후', '오전', '오후'];
        string = php.str_replace(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], unit_week, string);
        string = php.str_replace(['am', 'pm', 'AM', 'PM'], unit_meridiem, string);

        return string;
    }

    function rel2abs(base, relative) {
        var stack = base.split('/')
        var parts = relative.split('/');
        stack.pop(); // remove current file name (or empty string)
        // (omit if 'base' is the current folder without trailing slash)
        for (var i = 0; i < parts.length; i++) {
            if(parts[i] == '.') {
                continue;
            }

            if(parts[i] == '..') {
                stack.pop();
            } else {
                stack.push(parts[i]);
            }
        }
        return stack.join('/');
    }

    return {
        zdate: zdate,
        ztime: ztime,
        rel2abs: rel2abs,
        getMonthName: getMonthName
    , }
})();

module.exports = funcs;
