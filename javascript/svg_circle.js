
let stroke = 3;

function create_svg_context()
{
    return document.createElementNS("http://www.w3.org/2000/svg", "svg");
}

function set_svg_atributes(svg_context, height, width, id)
{
    svg_context.setAttribute("height", height);
    svg_context.setAttribute("id", id );
    svg_context.setAttribute("viewBox","0, 0, "+ height +","+ width);
    svg_context.setAttribute("width", width);
}

function set_svg_circle_atributes()
{
    var circle_element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle_element.setAttribute("fill", "#000000");
    circle_element.setAttribute("r", (stroke/2).toString());
    circle_element.setAttribute("stroke", "none");
    return circle_element;
}

function set_svg_path_atributes()
{
    path_data = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path_data.setAttribute("fill", "none");
    path_data.setAttribute("stroke", "#000000");
    path_data.setAttribute("stroke-width", stroke.toString());
    return path_data;
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees)
{
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
}
  
function describeArc(x, y, radius, startAngle, endAngle, c1, c2)
{
  
      var start = polarToCartesian(x, y, radius, endAngle);
      var end = polarToCartesian(x, y, radius, startAngle);
  
      var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
      var d = [
          "M", start.x, start.y, 
          "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ].join(" ");

      c2.setAttribute("cx", start.x);
      c2.setAttribute("cy", start.y);

      c1.setAttribute("cx", end.x);
      c1.setAttribute("cy", end.y);

      return d;       
}

function svg_start(svg_out)
{
    let svg_output = document.getElementById(svg_out) || document.getElementsByClassName(svg_out);
    let svg = create_svg_context(); 
    set_svg_atributes(svg, 50, 50);
    circle1 = set_svg_circle_atributes();
    circle2 = set_svg_circle_atributes();
    path_data = set_svg_path_atributes();
    svg_output.innerHTML = "";
    svg_output.appendChild(svg);
    return {
        svg_element: svg,
        circle_element1: circle1,
        circle_element2: circle2,
        path_element: path_data,
    }
    
}

function get_svg_num_output
(
    number_out, svg_obj, 
    details =  {
        start: 60,
        end: 0,
        increment: false,
        range: 1,
        current: 59,
        angle: 359,
        type : "s"
    }
)
{
    let count_display = document.getElementById(number_out) || document.getElementsByClassName(number_out);
    count_display.innerHTML = details.current + details.type;
    svg_obj.path_element.setAttribute("d",describeArc(25,25, 22, 0, details.angle, svg_obj.circle_element1, svg_obj.circle_element2));
    svg_obj.svg_element.appendChild(svg_obj.circle_element2);
    svg_obj.svg_element.appendChild(svg_obj.circle_element1);
    svg_obj.svg_element.appendChild(svg_obj.path_element);
    if(details.increment && details.angle == 0)
    {
        details.angle += 360/(details.start);
    }
    if(!details.increment && details.angle == 359)
    {
        details.angle -= 360/(details.start);
    }
    if(details.increment)
    {
        details.angle += 360/(details.start);
        details.current+= details.range;
        if(details.angle >= 359)
        {
            details.angle = 0;
        }
        if(details.current == details.start)
        {
            details.current = details.end;
        }
    }
    else
    {
        if(details.angle <= 0)
        {
            details.angle = 359;
        }
        if(details.current == details.end)
        {
            details.current = details.start;
        }
        details.angle -= 360/(details.start);
        details.current-= details.range;
    }
}

function start_timer(display1 , param_1, display2, param_2, display3, param_3)
{
    get_svg_num_output(display3.in, svg_start(display3.out), param_3);
    if(param_3.current == param_3.end)
    {
        get_svg_num_output(display2.in, svg_start(display2.out), param_2);
        if(param_2.current == param_2.end)
        {
            get_svg_num_output(display1.in, svg_start(display1.out), param_1);
        }
    }
}

function svg_timer_start(display1, display2, display3)
{
    param_1 = {
        start: 24,
        end: 0,
        increment: false,
        range: 1,
        current: 23,
        angle: 359,
        type : "h"
    }
    param_2 = {
        start: 60,
        end: 0,
        increment: false,
        range: 1,
        current: 59,
        angle: 359,
        type : "m"
    }
    param_3 = {
        start: 60,
        end: 0,
        increment: false,
        range: 1,
        current: 59,
        angle: 359,
        type : "s"
    }
    window.setInterval(start_timer,1000, display1, param_1, display2, param_2, display3, param_3);
    get_svg_num_output(display2.in, svg_start(display2.out), param_2);
    get_svg_num_output(display1.in, svg_start(display1.out), param_1);
    //window.setInterval(get_svg_num_output, 1000*60*60*24, display1.in, svg_start(display1.out), param_1); //para o tempo real
    //window.setInterval(get_svg_num_output, 1000*60, display2.in, svg_start(display2.out), param_2);  //para o tempo real
    //window.setInterval(get_svg_num_output, 1000, display3.in, svg_start(display3.out), param_3);
}