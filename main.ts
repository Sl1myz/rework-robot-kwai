/**
 * 110
 * 
 * 150
 */
/**
 * move 50/s = 25 cm
 * 
 * rotate 50/s = 180 deg
 */
function getCamBall () {
    huskylens.request()
    cam_current = huskylens.readBox_s(Content3.ID)
    if (huskylens.readeBox(cam_current, Content1.width) < 80 && huskylens.readeBox(cam_current, Content1.height) < 80) {
        cam_x = huskylens.readeBox(cam_current, Content1.xCenter)
        cam_y = huskylens.readeBox(cam_current, Content1.yCenter)
        huskylens.writeOSD("x:" + cam_x + " y:" + cam_y, cam_x, cam_y)
        return 1
    }
    return 0
}
function initialization () {
    pos_blue = [0, 0]
    pos_red = [75, 150]
    pos_current = [10, 10]
    pos_displacement = 0
    pos_degree = 90
}
function crashPrevention () {
    if (pos_current[0] < 15) {
        rotate(0 - pos_degree)
    } else if (pos_current[0] > 60) {
        rotate(180 - pos_degree)
    } else if (pos_current[1] < 30) {
        rotate(90 - pos_degree)
    } else if (pos_current[1] > 120) {
        rotate(270 - pos_degree)
    }
}
input.onButtonPressed(Button.A, function () {
    move(20)
})
function identifyCurrentBallColor () {
    huskylens.request()
    if (huskylens.readeBox(cam_current, Content1.xCenter) > 100 && huskylens.readeBox(cam_current, Content1.xCenter) < 130) {
        if (huskylens.readeBox(cam_current, Content1.yCenter) > 130 && huskylens.readeBox(cam_current, Content1.yCenter) < 170) {
            return cam_current
        }
    }
    return 0
}
function KickBall () {
    iBIT.Servo(ibitServo.SV1, 90)
    basic.pause(500)
    iBIT.Servo(ibitServo.SV1, 0)
}
function moveTo (x: number, y: number) {
    rotate(Math.atan2(y - pos_current[1], x - pos_current[0]) * (180 / (22 / 7)) - 0)
    move(Math.sqrt((y - pos_current[1]) * (y - pos_current[1]) + (x - pos_current[0]) * (x - pos_current[0])))
}
input.onButtonPressed(Button.B, function () {
    rotate(90)
})
function rotateTowardsTeamColor (ID: number) {
    if (ID == 1) {
        rotate(90 - pos_degree)
    } else if (ID == 2) {
        rotate(270 - pos_degree)
    }
}
function writeCOORD () {
    pos_current = [pos_current[0] + pos_displacement * Math.cos(pos_degree * 22 / 7 / 180), pos_current[1] + pos_displacement * Math.sin(pos_degree * 22 / 7 / 180)]
}
function move (unit: number) {
    iBIT.Motor(ibitMotor.Forward, 50)
    pos_displacement = unit
    basic.pause(unit * 40)
    pos_current[0] = pos_current[0] + Math.round(pos_displacement * Math.cos(pos_degree * (22 / 7 / 180)))
    pos_current[1] = pos_current[1] + Math.round(pos_displacement * Math.sin(pos_degree * (22 / 7 / 180)))
    iBIT.MotorStop()
}
function rotate (deg: number) {
    pos_degree = pos_degree % 360
    if (deg < 0) {
        iBIT.Spin(ibitSpin.Right, 50)
        basic.pause(deg * 1000 / 180)
        pos_degree = pos_degree + deg
        iBIT.MotorStop()
    } else {
        iBIT.Spin(ibitSpin.Left, 50)
        basic.pause(deg * 1000 / 180)
        pos_degree = pos_degree - deg
        iBIT.MotorStop()
    }
    while (pos_degree < 0) {
        pos_degree += 360
    }
}
let pos_degree = 0
let pos_displacement = 0
let pos_current: number[] = []
let pos_red: number[] = []
let pos_blue: number[] = []
let cam_y = 0
let cam_x = 0
let cam_current = 0
huskylens.initI2c()
huskylens.initMode(protocolAlgorithm.ALGORITHM_COLOR_RECOGNITION)
initialization()
basic.forever(function () {
    getCamBall()
    huskylens.writeOSD("pos: x:" + Math.trunc(pos_current[0]) + " y:" + Math.trunc(pos_current[1]), 0, 30)
})
