plot.csv <- function(csv.file){
  data <- read.csv(csv.file)
  plot(data$V, type="lines", col="green", ylim=c(0, 1))
  lines(data$I, col="red")
  lines(data$R, col="grey")
}
