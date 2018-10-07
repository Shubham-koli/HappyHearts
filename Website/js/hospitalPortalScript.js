function ExportToTable() {
  console.log("inside export table");

  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
  /*Checks whether the file is a valid excel file*/
  if (
    regex.test(
      $("#excelfile")
        .val()
        .toLowerCase()
    )
  ) {
    var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
    if (
      $("#excelfile")
        .val()
        .toLowerCase()
        .indexOf(".xlsx") > 0
    ) {
      xlsxflag = true;
    }
    /*Checks whether the browser supports HTML5*/
    if (typeof FileReader != "undefined") {
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;
        /*Converts the excel data in to object*/
        if (xlsxflag) {
          var workbook = XLSX.read(data, {
            type: "binary"
          });
        } else {
          var workbook = XLS.read(data, {
            type: "binary"
          });
        }
        /*Gets all the sheetnames of excel in to a variable*/
        var sheet_name_list = workbook.SheetNames;

        var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
        sheet_name_list.forEach(function(y) {
          /*Iterate through all sheets*/
          /*Convert the cell value to Json*/
          if (xlsxflag) {
            var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
          } else {
            var exceljson = XLS.utils.sheet_to_row_object_array(
              workbook.Sheets[y]
            );
          }
          if (exceljson.length > 0 && cnt == 0) {
            console.log("calling bind table");
            BindTable(exceljson, "#exceltable");
            cnt++;
          }
        });
        $("#exceltable").show();
      };
      if (xlsxflag) {
        /*If excel file is .xlsx extension than creates a Array Buffer from excel*/
        reader.readAsArrayBuffer($("#excelfile")[0].files[0]);
      } else {
        reader.readAsBinaryString($("#excelfile")[0].files[0]);
      }
    } else {
      alert("Sorry! Your browser does not support HTML5!");
    }
  } else {
    alert("Please upload a valid Excel file!");
  }
}

function BindTable(jsondata, tableid) {
  /*Function used to convert the JSON array to Html Table*/
  var columns = BindTableHeader(
    jsondata,
    tableid
  ); /*Gets all the column headings of Excel*/
  for (var i = 0; i < jsondata.length; i++) {
    var row$ = $("<tr/>");
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      var cellValue = jsondata[i][columns[colIndex]];
      if (cellValue == null) cellValue = "";
      row$.append($("<td/>").html(cellValue));

      console.log("after header before upload : " + i);
    }

    $(tableid).append(row$);
    upload(jsondata[i]);
  }
}

function BindTableHeader(jsondata, tableid) {
  /*Function used to get all column names from JSON and bind the html table header*/
  var columnSet = [];
  var headerTr$ = $("<tr/>");
  for (var i = 0; i < jsondata.length; i++) {
    var rowHash = jsondata[i];
    for (var key in rowHash) {
      if (rowHash.hasOwnProperty(key)) {
        if ($.inArray(key, columnSet) == -1) {
          /*Adding each unique column names to a variable array*/
          columnSet.push(key);
          headerTr$.append($("<th/>").html(key));
        }
      }
    }
  }
  $(tableid).append(headerTr$);
  return columnSet;
}

function upload(jsondataRow) {
  var URL = "http://localhost:4000/newpatient";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", URL, true);
  console.log("before onload");
  xhr.onload = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      //alert(xhr.responseText);
      alert("Your Patient File has been uploaded.");
    } else {
      alert("Failed To Upload Patient File");
    }
    // do something to response
    console.log("inside onload");
    console.log(this.responseText);
  };
  console.log("before data send");
  xhr.setRequestHeader("Content-Type", "application/json");
  //xhr.send(data);
  console.log(JSON.stringify(jsondataRow));
  jsondataRow.$class = "org.example.basic.Patient";
  console.log(JSON.stringify(jsondataRow));
  xhr.send(JSON.stringify(JSON.parse(JSON.stringify(jsondataRow))));
}
