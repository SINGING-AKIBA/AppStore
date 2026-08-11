import { Provide, Scope, ScopeEnum } from '@midwayjs/core';
@Provide()
@Scope(ScopeEnum.Singleton)
export class EChartsService {

  async getBarChart() {
 
  }

  private createChart(dom: HTMLElement, width: number, height: number): any {
   
  }

  private setBarOption(
    chart: any,
    weeks: string[],
    gmv: number[],
    liveSessions: number[],
    shortVideos: number[],
  ) {
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['交易额 (GMV)', '有效直播场次', '短视频数量'],
        top: 10,
        left: 'center',
        textStyle: { fontSize: 14 },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        top: '20%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: weeks,
        axisLabel: { fontSize: 13 },
      },
      yAxis: [
        {
          type: 'value',
          name: '交易额 (元)',
          nameTextStyle: { fontSize: 12 },
          axisLabel: { fontSize: 12 },
        }
      ],
      series: [
        {
          name: '交易额 (GMV)',
          type: 'bar',
          data: gmv,
          barWidth: '28%',
        },
        {
          name: '有效直播场次',
          type: 'bar',
          data: liveSessions,
          barWidth: '28%',
        },
        {
          name: '短视频数量',
          type: 'bar',
          data: shortVideos,
          barWidth: '28%',
        },
      ],
    });
  }
}