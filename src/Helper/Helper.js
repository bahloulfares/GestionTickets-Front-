import store from '../Redux/Store/Store';

const Helper = {
    getConfigErpValuebyCode: function (code) {
        return 3;
    },
      roundDecimalsWithSpaces: function (value, decimals) {
            let decimalsValue = decimals || Helper.getConfigErpValuebyCode("nbr_chiffre_virg");
            if ("string" === typeof value)
                value = parseFloat(value.replace(/\s/g, "").replace(/\&nbsp;/g, "")).toFixed(decimalsValue);
            return Number(Math.round(value + 'e' + decimalsValue) + 'e-' + decimalsValue).toLocaleString('fr', {minimumFractionDigits: decimalsValue}).replace(/,/g, '.');
        },
      
     roundDecimalsWithoutSpaces: function (value, decimals) {
            let decimalsValue = decimals || Helper.getConfigErpValuebyCode("nbr_chiffre_virg");
            if ("string" === typeof value)
                value = parseFloat(value.replace(/\s/g, "").replace(/\\&nbsp;/g, "")).toFixed(decimalsValue);
            if (isNaN(value))
                return null;
            return Number(Math.round(value + 'e' + decimalsValue) + 'e-' + decimalsValue).toFixed(decimalsValue);
        }, 

    formatCode: function (num, size) {
        let s = num + "";
        while (s.length < size)
            s = "0" + s;
        return s;
    },
    isEqual: function (value1, value2) {
        // Get the value type
        let type = Object.prototype.toString.call(value1);

        // If the two objects are not the same type, return false
        if (type !== Object.prototype.toString.call(value2)) return false;

        // If items are not an object or array, return false
        if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

        // Compare the length of the length of the two items
        let valueLen = type === '[object Array]' ? value1.length : Object.keys(value1).length;
        let otherLen = type === '[object Array]' ? value2.length : Object.keys(value2).length;
        if (valueLen !== otherLen) return false;

        // Compare two items
        let compare = function (item1, item2) {

            // Get the object type
            let itemType = Object.prototype.toString.call(item1);

            // If an object or array, compare recursively
            if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
                if (!Helper.isEqual(item1, item2)) return false;
            }

            // Otherwise, do a simple comparison
            else {

                // If the two items are not the same type, return false
                if (itemType !== Object.prototype.toString.call(item2)) return false;

                // Else if it's a function, convert to a string and compare
                // Otherwise, just compare
                if (itemType === '[object Function]') {
                    if (item1.toString() !== item2.toString()) return false;
                } else {
                    if (item1 !== item2) return false;
                }

            }
        };

        // Compare properties
        if (type === '[object Array]') {
            for (let i = 0; i < valueLen; i++) {
                if (compare(value1[i], value2[i]) === false) return false;
            }
        } else {
            for (let key in value1) {
                if (value1.hasOwnProperty(key)) {
                    if (compare(value1[key], value2[key]) === false) return false;
                }
            }
        }

        // If nothing failed, return true
        return true;
    },
    formatHeur: function (date, format) {
        let timeF;
        if (date === undefined || date === null)
            timeF = "";
        else {
            let d = new Date(date),
                hour = '' + (d.getHours()),
                minutes = '' + d.getMinutes(),
                seconds = d.getSeconds();

            if (isNaN(hour) || isNaN(minutes) || isNaN(seconds))
                timeF = "";
            else {
                if (hour.length < 2)
                    hour = '0' + hour;
                if (minutes.length < 2)
                    minutes = '0' + minutes;
                if (seconds.length < 2)
                    seconds = '0' + seconds;

                if (format === 'hh-mm-ss')
                    timeF = [hour, minutes, seconds].join(':');
                else if (format === 'hh-mm')
                    timeF = [hour, minutes].join(':');
            }
        }
        return timeF;
    },
    /**
     * @param {*} date timestamp
     * @param {*} format qui va retourner par exemple 'yyyy-MM-dd'
     */
    formatDate: function (date, format) {
        let dateF;
        if (date === undefined || date === null)
            dateF = "";
        else {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (isNaN(day) || isNaN(month) || isNaN(year))
                dateF = "";
            else {
                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                if (format === 'yyyy-MM-dd')
                    dateF = [year, month, day].join('-');
                else if (format === 'dd-MM-yyyy')
                    dateF = [day, month, year].join('-');
                else if (format === 'MM/dd/yyyy')
                    dateF = [month, day, year].join('/');
                else
                    dateF = [day, month, year].join('/');
            }
        }
        return dateF;
    },
    /**
     * return nb of last day for the month's date
     * @param {*} data : la date qu'on va traiter
     */
    getLastDayOfMonth: function (data) {
        let date = new Date(data);
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    },
    /**
   * return nb of first day for the month's date
   * this method every time return 01
   * @param {*} data : la date qu'on va traiter
   */
    getNbOfFirstDayOfMonth: function (data) {
        let date = new Date(data);
        return new Date(date.getFullYear(), date.getMonth(), 1).getDate();
    },
    /**
     * return nb of day for the month's date
     */
    getDayOfDate: function (data) {
        let date = new Date(data);
        return date.getDate();
    },
    getDateServeur: function () {
        return store.getState().HeaderReducer.dateServeur;
    },
    /**
     * return time stamp
     */
    getDateDebut: function () {
        return this.getFirstDayOfMonth(this.getDateServeur());
    },
    /**
     * return time stamp
     */
    getDateFin: function () {
        return this.getDateServeur();
    },
    /**
     * retur time stamp
     */
    getFirstDayOfMonth: function (date = this.getDateServeur()) {
        let firstDayOfMonthDate = new Date(date);
        return new Date(firstDayOfMonthDate.getFullYear(), firstDayOfMonthDate.getMonth(), 1).getTime();
    },
    dateRenderFromtimestamptoDate: function (data) {
        const date = new Date(data);
        return [
            ("0" + date.getDate()).slice(-2),           // Get day and pad it with zeroes
            ("0" + (date.getMonth() + 1)).slice(-2),      // Get month and pad it with zeroes
            date.getFullYear()                          // Get full year
        ].join('/');
    },
    /**
     * 
     * @param {*} dateToCompare1 
     * @param {*} dateToCompare2 
     * if dateToCompare1 egal dateToCompare2 return 0
     * if dateToCompare1 sup dateToCompare2 return 1
     * if dateToCompare1 inf dateToCompare2 return -1
     */
    compareTwoDate: function (dateToCompare1, dateToCompare2) {
        let date1 = new Date(dateToCompare1);
        let date2 = new Date(dateToCompare2);

        if (date1.getTime() === date2.getTime())
            return 0;

        if (date1.getTime() > date2.getTime())
            return 1;

        if (date1.getTime() < date2.getTime())
            return -1;

    }
};

export default Helper;