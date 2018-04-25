!function() {
    var a = "/Users/anesbitt/Google\ Drive/04_Textbooks/01_Climate/WebProjects/02_Emissions/" /** <!"http://www.slate.com/features/2014/05/climate/"; !>**/
    require.config({
        paths: {
            d3: a + "d3.v4.min",
            topojson: a + "topojson",
            Datamap: a + "datamaps"
        }
    }), require(["d3", "topojson", "Datamap"], function(b, c, d) {
        $(function() {
            function c(a, b) {
                this.container = $("#" + a), this.map_container = this.container.find(".map_container"), this.year_readout = this.container.find(".int_year"), this.printLegend();
                var c = this;
                this.makeMap(), this.country_codes = this.getAllCountryCodes(b.countries), this.timeline = new e(this), this.lineGraph = new f(b.world), this.data = b.countries, this.loadYear(i, function() {
                    c.play()
                })
            }
            function e(a) {
                this.container = a.container.find(".timeline"), this.btn_play = this.container.find(".btn_play"), this.svg_container = this.container.find(".timeline_svg_container"), this.line = this.container.find(".line_mark").css("height", this.svg_container.height() - m.top - m.bottom).css("bottom", m.bottom), this.par = a, this.addEventListeners()
            }
            function f(a) {
                var b = this;
                b.drawGraph(a)
            }
            function g() {
                $.getJSON(a + "emissions.json", function(a) {
                    new c("int", a)
                })
            }
            function h(a) {
                return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            var i = 1850,
                j = 2011,
                k = 150,
                l = 2,
                m = {
                    top: 10,
                    right: 45,
                    bottom: 12,
                    left: 0
                },
                n = ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"],
                o = [10, 20, 40, 80, 160, 320, 640, 1280, 2560],
                p = "CO<sub>2</sub> emissions by country (million tons)";
            c.prototype = {
                printLegend: function() {
                    var a = $("<div>").addClass("legend"),
                        b = $("<p>").addClass("legend_title").html(i).appendTo(a);
                    this.year_readout = b, function() {
                        var b = $("<div>").addClass("scale").appendTo(a);
                        $("<div>").addClass("legend_item scale_title").html(p).appendTo(b);
                        for (var c = 0; c < n.length; c++) {
                            {
                                var d = n[c],
                                    e = $("<div>").addClass("legend_item"),
                                    f = ($("<div>").addClass("legend_color").css("background-color", d).appendTo(e), (0 === c ? "&#8804;" : "") + h(o[c]) + (c === n.length - 1 ? "+" : ""));
                                $("<div>").html(f).addClass("legend_label").appendTo(e)
                            }
                            e.appendTo(b)
                        }
                    }(), this.legend = a.appendTo(this.container.find(".map_wrapper"))
                },
                getAllCountryCodes: function(a) {
                    var b = [],
                        c = a[2011];
                    for (var d in c)
                        c.hasOwnProperty(d) && b.push(d);
                    return b
                },
                makeMap: function() {
                    var a = this;
                    return this.m = new d({
                        element: document.getElementById("map_container_1"),
                        fills: {
                            defaultFill: n[0]
                        },
                        setProjection: function(a) {
                            var c = b.geo.mercator().center([0, 20]).rotate([4.4, 0]).scale(165).translate([a.offsetWidth / 2, a.offsetHeight / 2]),
                                d = b.geo.path().projection(c);
                            return {
                                path: d,
                                projection: c
                            }
                        },
                        geographyConfig: {
                            borderWidth: 1,
                            borderColor: "#FDFDFD",
                            popupTemplate: function(b) {
                                if (!a.current_year)
                                    return "";
                                var c = b.id,
                                    d = Math.round(a.data[a.current_year][c] || 0),
                                    e = "";
                                return e = d > 0 ? h(d) + " million tons of CO<sub>2</sub> emitted in " + a.current_year : "Negligible CO<sub>2</sub> emitted in " + a.current_year, '<div class="hoverinfo"><strong>' + b.properties.name + "</strong>: " + e + "</div>"
                            }
                        }
                    }), this
                },
                loadYear: function(a, b) {
                    var c = this;
                    this.timeline.setToYear(a, function() {
                        c.current_year = a;
                        var d = c.getChoroplethData(a);
                        c.m.updateChoropleth(d), c.year_readout.html(a), b && b()
                    })
                },
                getChoroplethData: function(a) {
                    this.colors = b.scale.linear();
                    var c = this.data[a],
                        d = {},
                        e = this;
                    return this.country_codes.forEach(function(a) {
                        d[a] = c[a] ? e.getColor(c[a]) : n[0]
                    }), d
                },
                getColor: function(a) {
                    for (var b = o, c = b.length - 1; c >= 0; c--)
                        if (a > b[c])
                            return n[c];
                    return n[0]
                },
                play: function() {
                    var a = this;
                    this.current_year === j ? this.loadYear(i, function() {
                        a.play()
                    }) : (this.is_playing = !0, this.advanceYear(), this.timeline.btn_play.html('<span class="icon">&#9724;</span> Stop').removeClass("play").addClass("stop"))
                },
                stop: function() {
                    this.is_playing = !1, this.timeline.btn_play.html('<span class="icon">&#9658;</span> Play').removeClass("stop").addClass("play")
                },
                advanceYear: function() {
                    var a = this;
                    this.is_playing && (this.current_year < j ? this.loadYear(Math.min(j, this.current_year + l), function() {
                        a.advanceYear()
                    }) : this.stop())
                },
                getWorldData: function() {}
            }, e.prototype = {
                addEventListeners: function() {
                    var a = this;
                    this.btn_play.click(function() {
                        a.par.is_playing ? a.par.stop() : a.par.play()
                    }), this.svg_container.click(function(b) {
                        if (!$(b.target).hasClass("btn_play")) {
                            a.par.is_playing && a.par.stop();
                            var c = a.eToYear(b);
                            a.par.loadYear(c)
                        }
                    }).on("mouseenter", function() {
                        a.ghost = $("<div>").addClass("ghost_line").css("height", a.svg_container.height() - m.top - m.bottom).css("bottom", m.bottom).appendTo(a.svg_container)
                    }).on("mousemove", function(b) {
                        var c = Math.min(b.pageX - a.container.offset().left, a.container.width() - m.right);
                        a.ghost.css("left", c)
                    }).on("mouseleave", function() {
                        a.ghost.remove()
                    })
                },
                setToYear: function(a, b) {
                    var c = this.yearToXpos(a);
                    this.line.animate({
                        left: c
                    }, k, "linear", b)
                },
                yearToXpos: function(a) {
                    var b = i,
                        c = j,
                        d = this.container.width() - m.right;
                    return Math.min(d, (a - b) / (c - b) * d)
                },
                eToYear: function(a) {
                    var b = a.pageX - this.container.offset().left,
                        c = i,
                        d = j,
                        e = Math.min(j, Math.round(c + b / (this.container.width() - m.right) * (d - c)));
                    return e
                }
            }, f.prototype = {
                drawGraph: function(a) {
                    a.reverse().sort(function(a, b) {
                        return a[0] < b[0] ? -1 : 1
                    });
                    var c = m,
                        d = $("#timeline").width() - c.right - c.left,
                        e = $("#timeline").height() - c.top - c.bottom,
                        f = b.scale.linear().domain([i, j]).range([0, d]),
                        g = b.scale.linear().domain([0, 3e4]).range([e, 0]),
                        h = b.svg.line().x(function(a) {
                            return f(a[0])
                        }).y(function(a) {
                            return g(a[1])
                        }),
                        k = b.select("#timeline").append("svg").attr("width", d + c.right + c.left).attr("height", e + c.top + c.bottom).append("g").attr("transform", "translate(" + c.left + "," + c.top + ")"),
                        l = b.svg.axis().scale(f).tickSize(-e).tickSubdivide(!0).tickFormat(b.format("d"));
                    k.append("svg:g").attr("class", "x axis").attr("transform", "translate(0," + (e + 2) + ")").call(l);
                    var n = b.svg.axis().tickSize(-d).scale(g).tickValues([0, 1e4, 2e4, 3e4]).orient("right");
                    k.append("svg:g").attr("class", "y axis").attr("transform", "translate(" + d + ",0)").call(n), k.append("path").attr("d", h(a))
                }
            }, "block" === $("#int").css("display") ? g() : $(window).resize(function() {
                "block" === $("#int").css("display") && ($(window).unbind("resize"), g())
            })
        })
    })
}();

