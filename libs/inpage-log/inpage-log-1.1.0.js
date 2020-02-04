/** In-page logging
 * @desc uses an output element to log
 *       strings within the svg graph
 * @version 1.1.0
 * 
 * @example log('any string 1', 'any string 2')
 * 
 * @param {any} _arguments to handle one or more values
 * @returns none
 */
!(function () {
    'use strict';
    // - - - - - - - - - -
    // 1. Global declaration
    // - - - - - - - - - -

    let
        output,
        log,
        size = 20,
        messages = ['ready.'],
        string = '',
        previousString = '',
        level = undefined;

    // - - - - - - - - - -
    // 2. Functions
    // - - - - - - - - - -
    /** The log function
     *
     * @version v1.0.0
     * @since 2020-02-04
     * @param {type} desc
     * @returns {void}
     */
    log = function () {
        let style = '',
            prefix = '',
            suffix = '',
            counter = 0;

        previousString = string;
        string = '';

        for (let i = 0; i < arguments.length; i += 1) {

            switch (arguments[i]) {
                case 'error':
                    prefix = '<i style="color:red;">';
                    suffix = '</i>';
                    string += prefix + arguments[i] + ' ';
                    break;
                case 'warning':
                    prefix = '<i style="color:orange;">';
                    suffix = '</i>';
                    string += prefix + arguments[i] + ' ';
                    break;
                case 'success':
                    prefix = '<i style="color:green;">';
                    suffix = '</i>';
                    string += prefix + arguments[i] + ' ';
                    break;
                case 'default':
                default:
                    if (i === 0)
                        string = arguments[i] + ', ';
                    if (i > 0)
                        string += arguments[i] + ', ';
                    suffix = '';
                    break;
            }
        }
        string = string.substring(0, string.length - 2) + suffix;

        if (previousString !== string) {

            if (log.level === arguments[0] || log.level === undefined)
                messages.push(string);
        }

        if (messages.length >= size) messages.shift();
        document.querySelector('#log').innerHTML = '';

        for (let i = 0; i < messages.length; i += 1) {
            document.querySelector('#log').innerHTML +=
                '&gt; ' +
                messages[i] +
                '<br />';
        }
    }

    /** Set ste styles
     *
     * @version v1.0.0
     * @since 2020-02-04
     * @returns {void}
     */
    function setStyles() {
        let style = document.createElement('style');
        style.innerText = '#log{opacity:0.5;font-family:Menlo;color:grey;display:block;position:absolute;right:1rem;top:1rem;font-size:12px;}';
        document.querySelector('body').appendChild(style);
    }

    /** Appends the output  to body
     *
     * @version v1.0.0
     * @since 2020-02-02
     * @returns {boolean}
     */
    function setOutputElement() {
        let context = document.body || undefined;

        if (context === undefined) return false;

        try {
            output = document.createElement('output');
            output.setAttribute('id', 'log');
            context.appendChild(output);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /** publish the log module
     *
     * @version v1.0.0
     * @since 2020-02-02
     * @param {string}   n name of the module
     * @param {function} f function
     * @returns {boolean}
     */
    function publish(n, f) {
        let
            name = n || undefined,
            fn = f || undefined;

        if (name === undefined) return false;
        if (fn === undefined) return false;

        try {
            window[name] = fn;
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // - - - - - - - - - - 
    // 2.3 Control functions 
    // - - - - - - - - - - 

    /** The main control
     *
     * @version v1.0.0
     * @since 2020-02-02
     * @returns {void}
     */
    function main() {
        setStyles();
        setOutputElement();
        publish('log', log);
    }

    /** Initialize the program
     *
     * @version v1.0.0
     * @since 2020-02-02
     * @returns {void}
     */
    function init() {
        main();
    };

    // - - - - - - - - - - 
    // 3. Main control
    // - - - - - - - - - -

    window.addEventListener('load', init);
    // - - - - - - - - - -
}());