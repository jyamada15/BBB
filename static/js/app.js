function metadatabuild(sample) {


    d3.json(`/metadata/${sample}`).then((data) => {
    var DISPLAY = d3.select("#sample-metadata");
     DISPLAY.html("");
    Object.entries(data).forEach(function([key, value]) {
      var i = DISPLAY.append("h6");
        i.text(`${key}: ${value}`);
    });
  });
}

function chartbuild(sample) {
  d3.json(`/samples/${sample}`).then((data) => {
    const sample_values = data.sample_values;
    const otu_labels = data.otu_labels;
    const otu_ids = data.otu_ids;


    var bubbleLayout = {

      hovermode: "closest",
      showlegend: false,
      xaxis: { title: "OTU ID" }
    };
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {

          size: sample_values,
          sizemode:'area',
          sizeref: .15,
          color: otu_ids,
          colorscale: "Viridis"
        },
      }
    ];

    Plotly.plot("bubble", bubbleData, bubbleLayout);

    var pieData = [
      {
        labels: otu_ids.slice(0, 10),
        values: sample_values.slice(0, 10),
        hovertext: otu_labels.slice(0, 10),
        hoverinfo: "hovertext",
        type: "pie"
      }
    ];

    var pieLayout = {
      showlegend: false,
      margin: { t: 0, l: 0 }
    };

    Plotly.plot("pie-ch", pieData, pieLayout);
  });
}




function init() {

  var selector = d3.select("#selDataset");


  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });



    const firstSample = sampleNames[0];
    chartbuild(firstSample);
    metadatabuild(firstSample);
  });
}

function optionChanged(newSample) {

  metadatabuild(newSample);

  chartbuild(newSample);




}

init();





