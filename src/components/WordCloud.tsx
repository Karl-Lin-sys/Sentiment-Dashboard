import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

interface Word {
  text: string;
  weight: number;
  sentiment: 'positive' | 'negative';
}

export function WordCloud({ words }: { words: Word[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || words.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = 300;

    // Clear previous
    d3.select(containerRef.current).selectAll('*').remove();

    const maxWeight = Math.max(...words.map(w => w.weight));
    const minWeight = Math.min(...words.map(w => w.weight));
    
    // Scale font size between 14 and 60
    const fontSizeScale = d3.scaleLinear()
      .domain([minWeight, maxWeight])
      .range([14, 60]);

    const layout = cloud()
      .size([width, height])
      .words(words.map(d => ({ text: d.text, size: fontSizeScale(d.weight), sentiment: d.sentiment })))
      .padding(5)
      .rotate(() => (~~(Math.random() * 2) * 90))
      .font("Inter")
      .fontSize(d => d.size!)
      .on("end", draw);

    layout.start();

    function draw(computedWords: any[]) {
      const svg = d3.select(containerRef.current)
        .append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr("transform", `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`);

      svg.selectAll("text")
        .data(computedWords)
        .enter().append("text")
        .style("font-size", d => `${d.size}px`)
        .style("font-family", "Inter")
        .style("fill", d => d.sentiment === 'positive' ? '#10b981' : '#ef4444')
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text(d => d.text);
    }
  }, [words]);

  return <div ref={containerRef} className="w-full h-[300px]" />;
}
