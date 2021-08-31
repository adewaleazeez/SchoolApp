
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}, account: {}, accountData: {}, initComplete: false, bank: null,
            welcomeMessages: ["What’s Your Dream?"]
        };
        this.loadInitData = this.loadInitData.bind(this);
    }

    async loadInitData() {
        //console.log("loadInitData init.json");
        await APICall("init.json", {}, "GET").then(data => {
            if (data.status === "success") {
                console.log("data: "+data.data);
                this.setState({
                    user: data.data.user, account: data.data.account, accountData: data.data.accountData,
                    initComplete: true
                },
                function () {
                        setTimeout(function () {
                                HideModal("welcome-modal");
                        }, 1000);
                });
            } else {
                window.location.href = "./user-login";
            }
            //

        }) // JSON-string from `response.json()` call
        .catch(error => {
                console.error(error);
        });
    }

    componentDidMount() {
        ShowModal("welcome-modal");
        this.loadInitData();
        // Toggle user info on sidebar
        $('.user-info-handle').on('click', function (event) {
                event.preventDefault();
                $('.user-info').toggleClass('closed');
        });

        // Toggle small sidebar


        // Toggle tooltips
        $('[data-toggle="tooltip"]').tooltip();

        // Toggle popovers
        $('[data-toggle="popover"]').popover();

        // For custom modal backdrop
        $('.modal[data-backdrop-color]').on('show.bs.modal hide.bs.modal', function () {
                $('body').toggleClass('modal-color-' + $(this).data('backdropColor'));
        });

        // Open right sidebar
        $('.open-right-sidebar').on('click', function (event) {
                event.preventDefault();
                $('.right-sidebar, .right-sidebar .sidebar-content').css('right', '0px');
        });
        $('.right-sidebar .close-icon').on('click', function (event) {
                event.preventDefault();
                $('.right-sidebar, .right-sidebar .sidebar-content').css('right', '-400px');
        });

        // Initialize panel controls
        $('[data-panel-control]').lobiPanel();

        // Visibility of source code button
        $('.src-btn').hide();
        $('.toggle-help-handle').on('click', function (event) {
                event.preventDefault();
                $('.src-btn').toggle();
        });

        // Visibility of source code button
        $('.src-code').hide();
        $('.toggle-code-handle').on('click', function (event) {
                event.preventDefault();
                $('.src-code').toggle();
        });

        // Toggle full screen
        $('.full-screen-handle').on('click', function (event) {
            event.preventDefault();
            if ((document.fullScreenElement && document.fullScreenElement !== null) ||
                (!document.mozFullScreen && !document.webkitIsFullScreen)) {
                if (document.documentElement.requestFullScreen) {
                        document.documentElement.requestFullScreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                        document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullScreen) {
                        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.cancelFullScreen) {
                        document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                }
            }
        });

        // Toggle sidebar dropdown
        $('.has-children').not('.open').find('.child-nav').slideUp('100');
        $('.has-children>a').on('click', function (event) {
            event.preventDefault();
            $(this).parent().toggleClass('open');
            $(this).parent().find('.child-nav').slideToggle('500');
        });

        // For Dropdown menu animation
        var dropdownSelectors = $('.dropdown, .dropup');

        // Custom function to read dropdown data
        // =========================
        function dropdownEffectData(target) {
            // @todo - page level global?
            var effectInDefault = null,
                    effectOutDefault = null;
            var dropdown = $(target),
                    dropdownMenu = $('.dropdown-menu', target);
            var parentUl = dropdown.parents('ul.nav');

            // If parent is ul.nav allow global effect settings
            if (parentUl.size() > 0) {
                    effectInDefault = parentUl.data('dropdown-in') || null;
                    effectOutDefault = parentUl.data('dropdown-out') || null;
            }

            return {
                    target: target,
                    dropdown: dropdown,
                    dropdownMenu: dropdownMenu,
                    effectIn: dropdownMenu.data('dropdown-in') || effectInDefault,
                    effectOut: dropdownMenu.data('dropdown-out') || effectOutDefault
            };
        }

        // Custom function to start effect (in or out)
        // =========================
        function dropdownEffectStart(data, effectToStart) {
            if (effectToStart) {
                data.dropdown.addClass('dropdown-animating');
                data.dropdownMenu.addClass('animated');
                data.dropdownMenu.addClass(effectToStart);
            }
        }

        // Custom function to read when animation is over
        // =========================
        function dropdownEffectEnd(data, callbackFunc) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            data.dropdown.one(animationEnd, function () {
                data.dropdown.removeClass('dropdown-animating');
                data.dropdownMenu.removeClass('animated');
                data.dropdownMenu.removeClass(data.effectIn);
                data.dropdownMenu.removeClass(data.effectOut);

                // Custom callback option, used to remove open class in out effect
                if (typeof callbackFunc === 'function') {
                        callbackFunc();
                }
            });
        }

        // Bootstrap API hooks
        // =========================
        dropdownSelectors.on({
            "show.bs.dropdown": function () {
                // On show, start in effect
                var dropdown = dropdownEffectData(this);
                dropdownEffectStart(dropdown, dropdown.effectIn);
            },
            "shown.bs.dropdown": function () {
                // On shown, remove in effect once complete
                var dropdown = dropdownEffectData(this);
                if (dropdown.effectIn && dropdown.effectOut) {
                    dropdownEffectEnd(dropdown, function () { });
                }
            },
            "hide.bs.dropdown": function (e) {
                // On hide, start out effect
                var dropdown = dropdownEffectData(this);
                if (dropdown.effectOut) {
                    e.preventDefault();
                    dropdownEffectStart(dropdown, dropdown.effectOut);
                    dropdownEffectEnd(dropdown, function () {
                        dropdown.dropdown.removeClass('open');
                    });
                }
            }
        });

    }

    render() {
        return (
            <div>
                {this.state.initComplete ? <Navbar user={this.state.user} account={this.state.account} /> : null}
                {this.state.initComplete ? <ContentWrapper accountData={this.state.accountData} user={this.state.user} account={this.state.account} loadInit={this.loadInitData} /> : null}

                <div className="modal vert-center fade trans-modal" id="welcome-modal"
                        tabIndex="-1" role="dialog" aria-labelledby="modal6Label" style={{ display: 'none', backgroundColor: "rgba(255,255,255,0.95)" }}>
                    <div className="modal-dialog  modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-body text-center">
                                <Spinner size="4rem" />
                                <h3 className="theme-color">{this.state.welcomeMessages[getRandomInt(0, 4)]}</h3>
                            </div>
                            <div className="modal-footer text-center"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

