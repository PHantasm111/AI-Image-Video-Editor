'use client'

import { Layer } from "@/lib/layer-store"
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider"

export default function ImageComparison({ layers }: { layers: Layer[] }) {
    if (layers.length === 0) {
        return <div>No layers selected for comparison</div>
    }
    if (layers.length === 1) {
        return (
            <div>
                <ReactCompareSliderImage
                    src={layers[0].url || ""}
                    srcSet={layers[0].url || ""}
                    alt={layers[0].name || "Single image"}
                    className="rounded-lg object-contain"
                />
            </div>
        )
    }


    return (
        <ReactCompareSlider
            itemOne={<ReactCompareSliderImage
                src={layers[0].url || ""}
                srcSet={layers[0].url || ""}
                alt={layers[0].name || "Image 1"}
            />}
            itemTwo={<ReactCompareSliderImage
                src={layers[1].url || ""}
                srcSet={layers[1].url || ""}
                alt={layers[1].name || "Image 2"}
            />}
        ></ReactCompareSlider>
    )
}