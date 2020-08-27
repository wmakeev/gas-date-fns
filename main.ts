/**
 * [date-fns](https://github.com/date-fns/date-fns/blob/master/src)
 */
namespace DateFns {
  const MILLISECONDS_IN_MINUTE = 60000

  export interface Interval {
    start: Date | number
    end: Date | number
  }

  function requiredArgs(required: number, args: IArguments) {
    if (args.length < required) {
      throw new TypeError(
        required +
          ' argument' +
          (required > 1 ? 's' : '') +
          ' required, but only ' +
          args.length +
          ' present'
      )
    }
  }

  /**
   * @name toDate
   * @category Common Helpers
   * @summary Convert the given argument to an instance of Date.
   *
   * @description
   * Convert the given argument to an instance of Date.
   *
   * If the argument is an instance of Date, the function returns its clone.
   *
   * If the argument is a number, it is treated as a timestamp.
   *
   * If the argument is none of the above, the function returns Invalid Date.
   *
   * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
   *
   * @param {Date|Number} argument - the value to convert
   * @returns {Date} the parsed date in the local time zone
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // Clone the date:
   * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
   * //=> Tue Feb 11 2014 11:30:30
   *
   * @example
   * // Convert the timestamp to date:
   * const result = toDate(1392098430000)
   * //=> Tue Feb 11 2014 11:30:30
   */
  function toDate(argument: Date | number) {
    requiredArgs(1, arguments)

    const argStr = Object.prototype.toString.call(argument)

    // Clone the date
    if (
      argument instanceof Date ||
      (typeof argument === 'object' && argStr === '[object Date]')
    ) {
      // Prevent the date to lose the milliseconds when passed to new Date() in IE10
      return new Date(argument.getTime())
    } else if (typeof argument === 'number' || argStr === '[object Number]') {
      return new Date(argument)
    } else {
      if (
        (typeof argument === 'string' || argStr === '[object String]') &&
        typeof console !== 'undefined'
      ) {
        // eslint-disable-next-line no-console
        console.warn(
          "Starting with v2.0.0-beta.1 date-fns doesn't accept strings as arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"
        )
        // @ts-ignore
        // eslint-disable-next-line no-console
        console.warn(new Error().stack)
      }
      return new Date(NaN)
    }
  }

  function toInteger(dirtyNumber: number | boolean | null) {
    if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
      return NaN
    }

    var number = Number(dirtyNumber)

    if (isNaN(number)) {
      return number
    }

    return number < 0 ? Math.ceil(number) : Math.floor(number)
  }

  /**
   * @name differenceInMilliseconds
   * @category Millisecond Helpers
   * @summary Get the number of milliseconds between the given dates.
   *
   * @description
   * Get the number of milliseconds between the given dates.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} dateLeft - the later date
   * @param {Date|Number} dateRight - the earlier date
   * @returns {Number} the number of milliseconds
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // How many milliseconds are between
   * // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
   * var result = differenceInMilliseconds(
   *   new Date(2014, 6, 2, 12, 30, 21, 700),
   *   new Date(2014, 6, 2, 12, 30, 20, 600)
   * )
   * //=> 1100
   */
  export function differenceInMilliseconds(
    dirtyDateLeft: Date | number,
    dirtyDateRight: Date | number
  ) {
    requiredArgs(2, arguments)

    var dateLeft = toDate(dirtyDateLeft)
    var dateRight = toDate(dirtyDateRight)
    return dateLeft.getTime() - dateRight.getTime()
  }

  /**
   * @name differenceInMinutes
   * @category Minute Helpers
   * @summary Get the number of minutes between the given dates.
   *
   * @description
   * Get the signed number of full (rounded towards 0) minutes between the given dates.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} dateLeft - the later date
   * @param {Date|Number} dateRight - the earlier date
   * @returns {Number} the number of minutes
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // How many minutes are between 2 July 2014 12:07:59 and 2 July 2014 12:20:00?
   * var result = differenceInMinutes(
   *   new Date(2014, 6, 2, 12, 20, 0),
   *   new Date(2014, 6, 2, 12, 7, 59)
   * )
   * //=> 12
   *
   * @example
   * // How many minutes are from 10:01:59 to 10:00:00
   * var result = differenceInMinutes(
   *   new Date(2000, 0, 1, 10, 0, 0),
   *   new Date(2000, 0, 1, 10, 1, 59)
   * )
   * //=> -1
   */
  export function differenceInMinutes(
    dirtyDateLeft: Date | number,
    dirtyDateRight: Date | number
  ) {
    requiredArgs(2, arguments)

    var diff =
      differenceInMilliseconds(dirtyDateLeft, dirtyDateRight) /
      MILLISECONDS_IN_MINUTE
    return diff > 0 ? Math.floor(diff) : Math.ceil(diff)
  }

  /**
   * @name getMonth
   * @category Month Helpers
   * @summary Get the month of the given date.
   *
   * @description
   * Get the month of the given date.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the given date
   * @returns {Number} the month
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // Which month is 29 February 2012?
   * var result = getMonth(new Date(2012, 1, 29))
   * //=> 1
   */
  export function getMonth(dirtyDate: Date | number) {
    requiredArgs(1, arguments)

    var date = toDate(dirtyDate)
    var month = date.getMonth()
    return month
  }

  /**
   * @name isWithinInterval
   * @category Interval Helpers
   * @summary Is the given date within the interval?
   *
   * @description
   * Is the given date within the interval? (Including start and end.)
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * - The function was renamed from `isWithinRange` to `isWithinInterval`.
   *   This change was made to mirror the use of the word "interval" in standard ISO 8601:2004 terminology:
   *
   *   ```
   *   2.1.3
   *   time interval
   *   part of the time axis limited by two instants
   *   ```
   *
   *   Also, this function now accepts an object with `start` and `end` properties
   *   instead of two arguments as an interval.
   *   This function now throws `RangeError` if the start of the interval is after its end
   *   or if any date in the interval is `Invalid Date`.
   *
   *   ```javascript
   *   // Before v2.0.0
   *
   *   isWithinRange(
   *     new Date(2014, 0, 3),
   *     new Date(2014, 0, 1), new Date(2014, 0, 7)
   *   )
   *
   *   // v2.0.0 onward
   *
   *   isWithinInterval(
   *     new Date(2014, 0, 3),
   *     { start: new Date(2014, 0, 1), end: new Date(2014, 0, 7) }
   *   )
   *   ```
   *
   * @param {Date|Number} date - the date to check
   * @param {Interval} interval - the interval to check
   * @returns {Boolean} the date is within the interval
   * @throws {TypeError} 2 arguments required
   * @throws {RangeError} The start of an interval cannot be after its end
   * @throws {RangeError} Date in interval cannot be `Invalid Date`
   *
   * @example
   * // For the date within the interval:
   * isWithinInterval(new Date(2014, 0, 3), {
   *   start: new Date(2014, 0, 1),
   *   end: new Date(2014, 0, 7)
   * })
   * //=> true
   *
   * @example
   * // For the date outside of the interval:
   * isWithinInterval(new Date(2014, 0, 10), {
   *   start: new Date(2014, 0, 1),
   *   end: new Date(2014, 0, 7)
   * })
   * //=> false
   *
   * @example
   * // For date equal to interval start:
   * isWithinInterval(date, { start, end: date }) // => true
   *
   * @example
   * // For date equal to interval end:
   * isWithinInterval(date, { start: date, end }) // => true
   */
  export function isWithinInterval(
    dirtyDate: Date | number,
    dirtyInterval: Interval
  ) {
    requiredArgs(2, arguments)

    var interval = dirtyInterval || {}
    var time = toDate(dirtyDate).getTime()
    var startTime = toDate(interval.start).getTime()
    var endTime = toDate(interval.end).getTime()

    // Throw an exception if start date is after end date or if any date is `Invalid Date`
    if (!(startTime <= endTime)) {
      throw new RangeError('Invalid interval')
    }

    return time >= startTime && time <= endTime
  }

  /**
   * @name getDaysInMonth
   * @category Month Helpers
   * @summary Get the number of days in a month of the given date.
   *
   * @description
   * Get the number of days in a month of the given date.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the given date
   * @returns {Number} the number of days in a month
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // How many days are in February 2000?
   * var result = getDaysInMonth(new Date(2000, 1))
   * //=> 29
   */
  export function getDaysInMonth(dirtyDate: Date | number) {
    requiredArgs(1, arguments)

    var date = toDate(dirtyDate)
    var year = date.getFullYear()
    var monthIndex = date.getMonth()
    var lastDayOfMonth = new Date(0)
    lastDayOfMonth.setFullYear(year, monthIndex + 1, 0)
    lastDayOfMonth.setHours(0, 0, 0, 0)
    return lastDayOfMonth.getDate()
  }

  /**
   * @name getDay
   * @category Weekday Helpers
   * @summary Get the day of the week of the given date.
   *
   * @description
   * Get the day of the week of the given date.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the given date
   * @returns {0|1|2|3|4|5|6} the day of week
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // Which day of the week is 29 February 2012?
   * var result = getDay(new Date(2012, 1, 29))
   * //=> 3
   */
  export function getDay(dirtyDate: Date | number) {
    requiredArgs(1, arguments)

    var date = toDate(dirtyDate)
    var day = date.getDay()
    return day
  }

  /**
   * @name isBefore
   * @category Common Helpers
   * @summary Is the first date before the second one?
   *
   * @description
   * Is the first date before the second one?
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the date that should be before the other one to return true
   * @param {Date|Number} dateToCompare - the date to compare with
   * @returns {Boolean} the first date is before the second date
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Is 10 July 1989 before 11 February 1987?
   * var result = isBefore(new Date(1989, 6, 10), new Date(1987, 1, 11))
   * //=> false
   */
  export function isBefore(
    dirtyDate: Date | number,
    dirtyDateToCompare: Date | number
  ) {
    requiredArgs(2, arguments)

    var date = toDate(dirtyDate)
    var dateToCompare = toDate(dirtyDateToCompare)
    return date.getTime() < dateToCompare.getTime()
  }

  /**
   * @name startOfMonth
   * @category Month Helpers
   * @summary Return the start of a month for the given date.
   *
   * @description
   * Return the start of a month for the given date.
   * The result will be in the local timezone.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the original date
   * @returns {Date} the start of a month
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // The start of a month for 2 September 2014 11:55:00:
   * var result = startOfMonth(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Mon Sep 01 2014 00:00:00
   */
  export function startOfMonth(dirtyDate: Date | number) {
    requiredArgs(1, arguments)

    var date = toDate(dirtyDate)
    date.setDate(1)
    date.setHours(0, 0, 0, 0)
    return date
  }

  /**
   * @name endOfMonth
   * @category Month Helpers
   * @summary Return the end of a month for the given date.
   *
   * @description
   * Return the end of a month for the given date.
   * The result will be in the local timezone.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the original date
   * @returns {Date} the end of a month
   * @throws {TypeError} 1 argument required
   *
   * @example
   * // The end of a month for 2 September 2014 11:55:00:
   * var result = endOfMonth(new Date(2014, 8, 2, 11, 55, 0))
   * //=> Tue Sep 30 2014 23:59:59.999
   */
  export function endOfMonth(dirtyDate: Date | number) {
    requiredArgs(1, arguments)

    var date = toDate(dirtyDate)
    var month = date.getMonth()
    date.setFullYear(date.getFullYear(), month + 1, 0)
    date.setHours(23, 59, 59, 999)
    return date
  }

  /**
   * @name addMonths
   * @category Month Helpers
   * @summary Add the specified number of months to the given date.
   *
   * @description
   * Add the specified number of months to the given date.
   *
   * ### v2.0.0 breaking changes:
   *
   * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
   *
   * @param {Date|Number} date - the date to be changed
   * @param {Number} amount - the amount of months to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
   * @returns {Date} the new date with the months added
   * @throws {TypeError} 2 arguments required
   *
   * @example
   * // Add 5 months to 1 September 2014:
   * var result = addMonths(new Date(2014, 8, 1), 5)
   * //=> Sun Feb 01 2015 00:00:00
   */
  export function addMonths(dirtyDate: Date | number, dirtyAmount: number) {
    requiredArgs(2, arguments)

    var date = toDate(dirtyDate)
    var amount = toInteger(dirtyAmount)
    if (isNaN(amount)) {
      return new Date(NaN)
    }
    if (!amount) {
      // If 0 months, no-op to avoid changing times in the hour before end of DST
      return date
    }
    var dayOfMonth = date.getDate()

    // The JS Date object supports date math by accepting out-of-bounds values for
    // month, day, etc. For example, new Date(2020, 1, 0) returns 31 Dec 2019 and
    // new Date(2020, 13, 1) returns 1 Feb 2021.  This is *almost* the behavior we
    // want except that dates will wrap around the end of a month, meaning that
    // new Date(2020, 13, 31) will return 3 Mar 2021 not 28 Feb 2021 as desired. So
    // we'll default to the end of the desired month by adding 1 to the desired
    // month and using a date of 0 to back up one day to the end of the desired
    // month.
    var endOfDesiredMonth = new Date(date.getTime())
    endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0)
    var daysInMonth = endOfDesiredMonth.getDate()
    if (dayOfMonth >= daysInMonth) {
      // If we're already at the end of the month, then this is the correct date
      // and we're done.
      return endOfDesiredMonth
    } else {
      // Otherwise, we now know that setting the original day-of-month value won't
      // cause an overflow, so set the desired day-of-month. Note that we can't
      // just set the date of `endOfDesiredMonth` because that object may have had
      // its time changed in the unusual case where where a DST transition was on
      // the last day of the month and its local time was in the hour skipped or
      // repeated next to a DST transition.  So we use `date` instead which is
      // guaranteed to still have the original time.
      date.setFullYear(
        endOfDesiredMonth.getFullYear(),
        endOfDesiredMonth.getMonth(),
        dayOfMonth
      )
      return date
    }
  }
}
