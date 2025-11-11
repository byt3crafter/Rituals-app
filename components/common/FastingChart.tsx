import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Line, G } from 'react-native-svg';
import { FastingSession } from '@/types';
import { theme } from '@/styles/theme';

interface FastingChartProps {
  data: FastingSession[];
}

const getPast7DaysData = (history: FastingSession[]) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - i));
    return { 
      name: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date,
      sessions: [] as { start: Date, end: Date, completed: boolean }[]
    };
  });

  history.forEach(session => {
    const sessionStartDate = new Date(session.startTime);
    const dayIndex = days.findIndex(d => d.date.toDateString() === sessionStartDate.toDateString());

    if (dayIndex !== -1) {
      days[dayIndex].sessions.push({
        start: sessionStartDate,
        end: new Date(session.endTime),
        completed: session.completed,
      });
    }
  });

  return days;
};

const FastingChart: React.FC<FastingChartProps> = ({ data }) => {
  const chartData = getPast7DaysData(data);
  const chartWidth = Dimensions.get('window').width - theme.spacing.large * 2;
  const chartHeight = 180;
  const barWidth = (chartWidth - theme.spacing.large) / chartData.length * 0.6;
  const yAxisWidth = 30;

  const hourLabels = [0, 6, 12, 18, 24];

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={chartHeight}>
        {/* Y-Axis Labels and Grid Lines */}
        <G>
            {hourLabels.map(hour => {
                const y = ((hour / 24) * (chartHeight - 20)) + 10;
                return (
                    <G key={hour}>
                        <SvgText
                            x={yAxisWidth - 10}
                            y={y + 4}
                            fill={theme.colors.onSurfaceFaded}
                            fontSize="10"
                            textAnchor="end"
                        >
                            {hour}h
                        </SvgText>
                        <Line
                            x1={yAxisWidth}
                            y1={y}
                            x2={chartWidth}
                            y2={y}
                            stroke={theme.colors.surface}
                            strokeWidth="1"
                        />
                    </G>
                )
            })}
        </G>

        {/* Bars */}
        {chartData.map((entry, index) => {
            const x = yAxisWidth + (index * (chartWidth - yAxisWidth) / chartData.length) + barWidth * 0.5;

            // Full day background bar
            const bar = (
                <Rect
                    x={x}
                    y={10}
                    width={barWidth}
                    height={chartHeight - 30}
                    fill={theme.colors.surface}
                    rx={4}
                />
            );

            // Fasting session rects
            const fastingRects = entry.sessions.map((session, sIndex) => {
                const startHour = session.start.getHours() + session.start.getMinutes() / 60;
                const endHour = session.end.getHours() + session.end.getMinutes() / 60;
                const duration = endHour - startHour > 0 ? endHour - startHour : (24 - startHour) + endHour;
                
                const fastingY = ((startHour / 24) * (chartHeight - 30)) + 10;
                const fastingHeight = (duration / 24) * (chartHeight - 30);
                
                return (
                    <Rect
                        key={sIndex}
                        x={x}
                        y={fastingY}
                        width={barWidth}
                        height={fastingHeight}
                        fill={session.completed ? theme.colors.secondary : theme.colors.primary}
                        rx={4}
                    />
                )
            })

            return (
            <React.Fragment key={index}>
                {bar}
                {fastingRects}
                <SvgText
                    x={x + barWidth / 2}
                    y={chartHeight - 5}
                    fill={theme.colors.onSurfaceFaded}
                    fontSize="12"
                    textAnchor="middle"
                >
                    {entry.name}
                </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 180,
        marginTop: theme.spacing.medium,
    }
});

export default FastingChart;
