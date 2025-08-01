'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import data from '../lib/data.json' // Adjust the path based on your project structure
import AnimatedNumber from './PopulationLabels';
import { getCountryCode } from '../lib/getCountryCode';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChartRace = () => {
    const [currentYear, setCurrentYear] = useState<number>(1990);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const animationRef = useRef(null);
    const chartRef = useRef(null);

    const countryColors = {
        'China': '#f44336',
        'India': '#4CAF50',
        'United States': '#2196F3',
        'Indonesia': '#FFC107',
        'Pakistan': '#9C27B0',
        'Brazil': '#009688',
        'Nigeria': '#FF5722',
        'Bangladesh': '#607D8B',
        'Russia': '#E91E63',
        'Mexico': '#795548',
        'Japan': '#3F51B5',
        'Ethiopia': '#8BC34A',
        'Philippines': '#00BCD4',
        'Egypt': '#CDDC39',
        'Vietnam': '#9E9E9E'
    } as any;

    const getChartData = () => {
        const yearData = data.find(item => item.Year === currentYear);
        if (!yearData) return { labels: [], datasets: [] };

        const sortedCountries = [...yearData.Countries].sort((a, b) => b.Population - a.Population)

        return {
            labels: sortedCountries.map(country => country.Country),
            datasets: [{
                label: `Population (Millions)`,
                data: sortedCountries.map(country => country.Population / 1000000),
                backgroundColor: sortedCountries.map(country => countryColors[country?.Country] || '000000'),
                borderWidth: 1
            }]
        }
    }

    const navigateYears = (direction: 'prev' | 'next') => {
        setIsPlaying(false);
        if (animationRef.current) {
            clearTimeout(animationRef.current);
        }

        setCurrentYear(prev => {
            if (direction === 'prev') {
                return prev > 1990 ? prev - 1 : 2009;
            } else {
                return prev < 2009 ? prev + 1 : 1990;
            }
        });
    };

    useEffect(() => {
        if (isPlaying) {
            animationRef.current = setTimeout(() => {
                setCurrentYear(prev => {
                    const nextYear = prev + 1;
                    if (nextYear > 2009) {
                        setIsPlaying(false);
                        return 1990;
                    }
                    return nextYear;
                });
            }, 1000) as any
        }

        return () => clearTimeout(animationRef.current as any);
    }, [isPlaying, currentYear]);

    const togglePlay = () => setIsPlaying(!isPlaying);
    const resetAnimation = () => {
        setIsPlaying(false)
        setCurrentYear(1990)
    }

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 800,
            easing: 'linear'
        },
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: `World Population by Year - ${currentYear}`,
                font: {
                    size: 30,
                    family: 'Fjalla One',
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        return `${context.label}: ${context.raw.toLocaleString()} million`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Population (Millions)'
                },
                beginAtZero: true,
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    mirror: true,
                    color: 'black',
                    font: {
                        weight: 'bold'
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            }
        }
    } as any;


    return (
        <div className="relative w-full max-w-[900px] h-[600px] mx-auto">
            <button
                onClick={() => navigateYears('prev')}
                className="absolute left-[-50px] top-1/2 -translate-y-1/2 text-2xl text-blue-500 z-10 cursor-pointer bg-none border-none"
            >
                &#9664;
            </button>

            <button
                onClick={() => navigateYears('next')}
                className="absolute right-[-50px] top-1/2 -translate-y-1/2 text-2xl text-blue-500 z-10 cursor-pointer bg-none border-none"
            >
                &#9654;
            </button>

            <div className="mb-5 flex items-center gap-2">
                <button onClick={togglePlay} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <button onClick={resetAnimation} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    ↺ Reset
                </button>
                <input
                    type="range"
                    min="1990"
                    max="2009"
                    value={currentYear}
                    onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                    className="flex-grow accent-blue-500"
                />
            </div>

            <div className='flex items-center w-[700px]'>
                <Bar ref={chartRef} data={getChartData()} options={options} height={410} />
                <div className="w-full flex flex-col justify-between h-[calc(100%-140px)] pr-2 pointer-events-none text-sm font-semibold">
                    {data.find(item => item.Year === currentYear)?.Countries
                        .sort((a, b) => b.Population - a.Population)
                        .map((country) => {
                            const code = getCountryCode(country.Country)
                            return (
                                <div
                                    key={country.Country}
                                    className="flex-1 flex items-center justify-start gap-2"
                                >
                                    {/* Flag and country name */}
                                    <div className="flex text-right items-center gap-1 w-[120px]">
                                        <img
                                            src={`https://flagcdn.com/w40/${code}.png`}
                                            alt={country.Country}
                                            className="w-5 h-4 object-cover rounded-sm"
                                        />
                                        <span className="w-[500px]">{country.Country}</span>
                                    </div>

                                    {/* Animated population number */}
                                    <AnimatedNumber value={country.Population / 1_000_000} />
                                </div>
                            );
                        })}
                </div>

            </div>
        </div>

    )
}

export default BarChartRace