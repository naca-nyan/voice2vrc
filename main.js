const commands = [
  {
    if: (t) => t.includes("着る") || t.includes("切る"),
    path: "/avatar/parameters/Outer",
    value: 1,
  },
  {
    if: (t) => t.includes("脱ぐ"),
    path: "/avatar/parameters/Outer",
    value: 0,
  },
];

function evtypelog(event) {
  console.log(event.type);
}

function start() {
  const $input = document.querySelector("#input");
  /** @type {SpeechRecognition} */
  const re = new (webkitSpeechRecognition || SpeechRecognition)();
  re.onaudiostart = evtypelog;
  re.onaudioend = evtypelog;
  re.onerror = console.log;
  re.onstart = evtypelog;
  re.onnomatch = console.log;
  re.onsoundend = evtypelog;
  re.onsoundstart = evtypelog;
  re.onspeechstart = evtypelog;
  re.onspeechend = evtypelog;
  re.addEventListener("result", (event) => {
    console.log(event);

    const result = event.results.item(0).item(0).transcript;
    $input.textContent = result;
    commands.forEach(({ if: test, path, value }) => {
      if (test(result)) {
        console.log(path, value);
        fetch("http://localhost:9090/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: path,
            value: value,
          }),
        });
      }
    });
  });
  re.addEventListener("end", (event) => {
    console.log(event);
    re.start();
  });
  re.start();
}
