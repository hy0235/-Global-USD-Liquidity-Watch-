import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Indicator, Language } from '../types';

interface BubbleMapProps {
  onshore: Indicator[];
  offshore: Indicator[];
  onSelect: (indicator: Indicator) => void;
  selectedId?: string;
  lang: Language;
}

const getLinks = (nodes: any[]) => {
  const links: { source: string; target: string; strength: number }[] = [];
  const addLink = (sourceCode: string, targetCode: string, strength: number = 1) => {
    const source = nodes.find(n => n.code === sourceCode);
    const target = nodes.find(n => n.code === targetCode);
    if (source && target) {
      links.push({ source: source.id, target: target.id, strength });
    }
  };

  // --- 在岸逻辑 ---
  addLink('TGA', 'ON RRP', 0.8);
  addLink('TGA', 'Reserves', 0.9);
  addLink('WALCL', 'Reserves', 0.95);
  addLink('ON RRP', 'SOFR', 0.8);
  addLink('Basis', 'LevShorts', 0.95);
  addLink('SOFR', 'Basis', 0.6);
  
  // --- 离岸逻辑 ---
  addLink('USDJPY', 'JP10Y', 0.9);
  addLink('BoJRate', 'USDJPY', 0.8);
  addLink('JPYCBS', 'USDJPY', 0.9);
  addLink('EURCBS', 'TED', 0.7);
  addLink('BISCredit', 'EURCBS', 0.6);
  
  // --- 跨市场逻辑 ---
  addLink('FFR', 'Reserves', 0.7);
  addLink('FFR', 'USDJPY', 0.6);
  addLink('SOFR', 'JPYCBS', 0.5);

  return links;
};

const BubbleMap: React.FC<BubbleMapProps> = ({ onshore, offshore, onSelect, selectedId, lang }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const [data] = useState(() => {
    const combinedNodes = [
      ...onshore.map(i => ({ ...i, group: 'onshore' })), 
      ...offshore.map(i => ({ ...i, group: 'offshore' }))
    ];
    const fedNodes = [
        { id: 'fed-1', code: 'FFR', weight: 10, group: 'fed', currentValue: 4.50, unit: '%' },
        { id: 'fed-2', code: 'SEP2026', weight: 8, group: 'fed', currentValue: 3.4, unit: '%' }
    ];
    const allNodes = [...combinedNodes, ...fedNodes];
    return {
      nodes: allNodes,
      links: getLinks(allNodes)
    };
  });

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;

    const width = wrapperRef.current.clientWidth;
    const height = window.innerWidth < 768 ? 450 : 600;
    
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", `max-width: 100%; height: auto; background-color: #0F1115;`);

    const simulation = d3.forceSimulation(data.nodes as any)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(width < 768 ? 90 : 130))
      .force("charge", d3.forceManyBody().strength(width < 768 ? -400 : -800))
      .force("collide", d3.forceCollide().radius((d: any) => getSize(d.weight) + (width < 768 ? 10 : 25)))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX((d: any) => {
        if (d.group === 'onshore') return width * 0.3;
        if (d.group === 'offshore') return width * 0.7;
        return width * 0.5;
      }).strength(0.1));

    const colorOnshore = "#3B82F6"; 
    const colorOffshore = "#8B5CF6"; 
    const colorFed = "#EF4444";
    const colorSelected = "#F59E0B"; 

    const link = svg.append("g")
      .attr("stroke", "#334155")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", 1.5);

    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(drag(simulation) as any)
      .on("click", (event, d) => {
          if (d.group !== 'fed') {
            onSelect(d as unknown as Indicator);
          }
          event.stopPropagation();
      });

    node.append("circle")
      .attr("r", (d: any) => getSize(d.weight))
      .attr("fill", (d: any) => {
          if (d.id === selectedId) return colorSelected;
          if (d.group === 'onshore') return colorOnshore;
          if (d.group === 'offshore') return colorOffshore;
          return colorFed;
      })
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.2)
      .style("filter", "drop-shadow(0px 4px 8px rgba(0,0,0,0.3))");

    node.append("text")
      .text((d: any) => d.code)
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .attr("fill", "#ffffff")
      .attr("font-weight", "900")
      .attr("font-size", (d: any) => Math.min(getSize(d.weight) / 2.2, width < 768 ? 9 : 12))
      .style("pointer-events", "none");

    node.append("text")
      .text((d: any) => `${d.currentValue}${d.unit}`)
      .attr("text-anchor", "middle")
      .attr("dy", "1.3em")
      .attr("fill", "rgba(255,255,255,0.7)")
      .attr("font-weight", "700")
      .attr("font-size", (d: any) => Math.min(getSize(d.weight) / 3, width < 768 ? 7 : 10))
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    return () => simulation.stop();
  }, [data, selectedId]);

  const getSize = (weight: number) => {
      const base = window.innerWidth < 768 ? 24 : 35;
      return base + (weight * 3.5);
  };

  return (
    <div ref={wrapperRef} className="w-full bg-[#0F1115] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-800 relative group">
        <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-3 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-full border border-blue-500/30 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-[10px] text-blue-200 font-black uppercase tracking-tighter">Onshore</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-full border border-purple-500/30 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-[10px] text-purple-200 font-black uppercase tracking-tighter">Offshore</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-full border border-red-500/30 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-[10px] text-red-200 font-black uppercase tracking-tighter">Fed</span>
            </div>
        </div>
        <svg ref={svgRef} className="w-full h-[450px] md:h-[600px] block"></svg>
    </div>
  );
};

export default BubbleMap;