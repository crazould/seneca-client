<template>
  <v-container fluid>
    <div v-if="courses.length != 0">
      <v-row v-for="(course, index) in courses" :key="index">
        <v-col>
          <v-card min-height="280" class="pa-2" elevation="6">
            <v-card-title
              class="font-weight-light text-h4 text-sm-h3 text-md-h2 text-truncate"
              style="display: block"
            >
              {{ course.subject.Subject }}
            </v-card-title>
            <v-card-subtitle
              class="font-weight-light text-h6 text-sm-h5 text-md-h4"
            >
              {{ course.subject.Class }}
            </v-card-subtitle>
            <v-card-text class="mb-5">
              <v-row>
                <v-col
                  v-for="(chart, i) in chartSets[index]"
                  :key="`chart-${i}`"
                  cols="12"
                  md="6"
                  lg="4"
                >
                  <material-chart-card
                    :color="chart.color"
                    :data="chart.data"
                    :options="chart.options"
                    :responsive-options="chart.responsiveOptions"
                    :title="chart.title"
                    :type="chart.type"
                    class="pb-5"
                  >
                  </material-chart-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row>
        <v-col>
          <material-alert
            icon="mdi-alert"
            class="text-body-1"
          >
            No data available 😣
          </material-alert>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import Vue from "vue";
import { sync } from "vuex-pathify";

const lineSmooth = Vue.chartist.Interpolation.cardinal({
  tension: 0
});
export default {
  name: "Dashboard",
  components: {},
  data: () => ({
    chartSet: [
      {
        type: "Line",
        color: "primary",
        title: "Completed Task by Day",
        data: {
          labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          series: [[0, 0, 0, 0, 0, 0, 0]]
        },
        options: {
          axisX: {
            showGrid: false
          },
          low: 0,
          high: 10,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0
          }
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function(value) {
                  return value[0];
                }
              }
            }
          ]
        ]
      },
      {
        type: "Line",
        color: "secondary",
        title: "Completed Task by Month",
        time: "updated 4 minutes ago",
        data: {
          labels: [
            "Ja",
            "Fe",
            "Ma",
            "Ap",
            "Ma",
            "Jn",
            "Jl",
            "Au",
            "Se",
            "Oc",
            "No",
            "De"
          ],
          series: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
        },
        options: {
          lineSmooth,
          low: 0,
          high: 10,
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      },
      {
        type: "Pie",
        color: "error",
        title: "Overall Productivity",
        data: {
          labels: ["Completed (0%)", "Others (0%)"],
          series: [[0, 0]]
        },
        options: {
          lineSmooth,
          low: 0,
          high: 10,
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      }
    ],
    chartSets: [],
    courses: [],
    isLoading: false,
    message: ""
  }),
  computed: {
    ...sync("user", ["currSemester", "currCourses"]),
    user: function() {
      return JSON.parse(this.$session.get("user"));
    }
  },
  watch: {
    currCourses(newValue) {
      this.courses = newValue;
      this.setChartData();
    }
  },
  mounted() {
    this.courses = [];
    this.courses = this.$store.get("user/currCourses");
    this.setChartData();
  },
  methods: {
    setChartData() {
      if (this.courses.length == 0) return;
      if (!this.courses.length) return;

      this.chartSets = [];

      this.courses.forEach(course => {
        window.Database.ref(
          `Subjects/${course.subject.ClassTransactionId}/Groups/${course.group.Group.GroupNumber}/Phases/`
        ).once("value", s => {
          let phases = s.val();
          let completedTasks = [];
          let otherTasks = [];

          // console.log(`phases ${course.subject.Subject}:`);
          // console.log(phases);
          this.resetChartSetValue();

          if (phases == undefined) {
            // console.log("RETURN");
            // console.log(`phases ${course.subject.Subject}:`);

            this.chartSets.push(this.chartSet);
            // this.chartSets = [...this.chartSets, this.chartSet]

            return;
          }

          if (phases && phases.length != 0) {
            phases.forEach(phase => {
              if (phase.Categories != undefined) {
                phase.Categories.forEach(category => {
                  if (category.Name == "Completed") {
                    completedTasks = completedTasks.concat(category.Tasks);
                    // completedTasks =  [...completedTasks, ...category.Tasks];
                  } else {
                    // otherTasks = [...otherTasks, ...category.Tasks];
                    otherTasks = otherTasks.concat(category.Tasks);
                  }
                });
              }
            });
          }

          // console.log(`completed Tasks: `);
          // console.log(completedTasks);
          // let countDay = [], countMonth = []

          completedTasks.forEach(element => {
            let dueDate = new Date(element.DueDate);
            let dayIdx = dueDate.getDay();
            let monthIdx = dueDate.getMonth();
            this.chartSet[0].data.series[0][dayIdx]++;
            this.chartSet[1].data.series[0][monthIdx]++;
          });

          // this.chartSet[0].data.series[0] = countDay
          // this.chartSet[1].data.series[0] = countMonth

          let totalTasks = completedTasks.length + otherTasks.length;

          if (completedTasks.length != 0) {
            let completePresentage = Math.round(
              (completedTasks.length / totalTasks) * 100
            );
            this.chartSet[2].data.series[0][0] = completedTasks.length;
            this.chartSet[2].data.labels[0] = `Completed (${completePresentage}%)`;
          }

          if (otherTasks.length != 0) {
            let otherPresentage = Math.round(
              (otherTasks.length / totalTasks) * 100
            );
            this.chartSet[2].data.series[0][1] = otherTasks.length;
            this.chartSet[2].data.labels[1] = `Others (${otherPresentage}%)`;
          }

          let maxValue = Math.max(...this.chartSet[0].data.series[0]);
          if (maxValue) {
            this.chartSet[0].options.high = maxValue + maxValue / 3;
          }

          maxValue = Math.max(...this.chartSet[1].data.series[0]);
          if (maxValue) {
            this.chartSet[1].options.high = maxValue + maxValue / 3;
          }
          maxValue = Math.max(...this.chartSet[2].data.series[0]);

          if (maxValue) {
            this.chartSet[2].options.high = maxValue + maxValue / 3;
          }

          // console.log(this.chartSet[0].data.series[0]);
          // console.log(this.chartSet[0].options.high);

          // console.log(`other Tasks: `);
          // console.log(otherTasks);

          this.chartSets.push(this.chartSet);
          // this.chartSets = [...this.chartSets, this.chartSet]
        });
      });
    },
    resetChartSetValue() {
      this.chartSet = [
        {
          type: "Line",
          color: "primary",
          title: "Completed Task by Day",
          data: {
            labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            series: [[0, 0, 0, 0, 0, 0, 0]]
          },
          options: {
            axisX: {
              showGrid: false
            },
            low: 0,
            high: 5,
            chartPadding: {
              top: 0,
              right: 5,
              bottom: 0,
              left: 0
            }
          },
          responsiveOptions: [
            [
              "screen and (max-width: 640px)",
              {
                seriesBarDistance: 5,
                axisX: {
                  labelInterpolationFnc: function(value) {
                    return value[0];
                  }
                }
              }
            ]
          ]
        },
        {
          type: "Line",
          color: "secondary",
          title: "Completed Task by Month",
          time: "updated 4 minutes ago",
          data: {
            labels: [
              "Ja",
              "Fe",
              "Ma",
              "Ap",
              "Ma",
              "Jn",
              "Jl",
              "Au",
              "Se",
              "Oc",
              "No",
              "De"
            ],
            series: [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
          },
          options: {
            lineSmooth,
            low: 0,
            high: 5,
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }
          }
        },
        {
          type: "Bar",
          color: "error",
          title: "Overall Productivity",
          data: {
            labels: ["Completed (0%)", "Others (0%)"],
            series: [[0, 0]]
          },
          options: {
            lineSmooth,
            low: 0,
            high: 5,
            chartPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }
          }
        }
      ];
    }
  }
};
</script>
